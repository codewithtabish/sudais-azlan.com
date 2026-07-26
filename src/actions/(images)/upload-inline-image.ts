"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Upload an inline blog image to S3.
 *
 * Pipeline:
 * 1. Validate MIME type (JPEG, PNG, WebP, AVIF, GIF)
 * 2. Validate upload size (max 8 MB)
 * 3. Validate image can be decoded by Sharp
 * 4. Auto-rotate via EXIF
 * 5. Reject extreme aspect ratios (< 1:3 or > 3:1)
 * 6. Resize to fit inside 1600×1600 (never enlarge, never crop)
 * 7. Convert to WebP (quality 85, effort 4)
 * 8. Strip all metadata / EXIF
 * 9. Upload to S3 under blog-inline/
 * 10. Return S3 URL
 */
export async function uploadInlineBlogImage(
  fileData: number[],
  fileType: string,
  fileName: string,
): Promise<{ fileUrl: string }> {
  try {
    // ── 1. Validate MIME type ──────────────────────────────────────────
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ];

    if (!allowedMimeTypes.includes(fileType)) {
      throw new Error(
        "Unsupported image format.\n\nPlease upload JPEG, PNG, WebP, AVIF, or GIF.",
      );
    }

    // ── 2. Validate upload size (max 8 MB) ───────────────────────────
    const MAX_SIZE_BYTES = 8 * 1024 * 1024;
    if (fileData.length > MAX_SIZE_BYTES) {
      throw new Error("Image exceeds the maximum upload size of 8 MB.");
    }

    // ── 3. Convert incoming data to Buffer ─────────────────────────────
    const inputBuffer = Buffer.from(fileData);
    if (inputBuffer.length === 0) {
      throw new Error("Input file is empty");
    }

    console.log(
      "[Inline Upload] Received:",
      fileName,
      "| Type:",
      fileType,
      "| Size:",
      inputBuffer.length,
      "bytes",
    );

    // ── 4. Validate image can be decoded ─────────────────────────────
    try {
      await sharp(inputBuffer).metadata();
    } catch {
      throw new Error("Invalid image file.");
    }

    // ── 5. Auto-rotate based on EXIF ───────────────────────────────────
    const rotatedBuffer = await sharp(inputBuffer).rotate().toBuffer();
    const meta = await sharp(rotatedBuffer).metadata();
    const originalWidth = meta.width ?? 0;
    const originalHeight = meta.height ?? 0;

    if (!originalWidth || !originalHeight) {
      throw new Error("Unable to read image dimensions");
    }

    console.log(
      "[Inline Upload] Dimensions:",
      originalWidth,
      "x",
      originalHeight,
    );

    // ── 6. Reject extreme aspect ratios ──────────────────────────────
    const ratio = originalWidth / originalHeight;
    const MIN_RATIO = 1 / 3; // 1:3
    const MAX_RATIO = 3; // 3:1

    if (ratio < MIN_RATIO || ratio > MAX_RATIO) {
      throw new Error(
        "Image aspect ratio is too extreme.\n\nPlease use a standard photo ratio (between 1:3 and 3:1).",
      );
    }

    console.log("[Inline Upload] Aspect ratio OK:", ratio.toFixed(3));

    // ── 7. Resize to fit inside 1600×1600 (never enlarge) ────────────
    const processedBuffer = await sharp(rotatedBuffer)
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 4,
      })
      .withMetadata({}) // strip EXIF/metadata
      .toBuffer();

    console.log(
      "[Inline Upload] Processed size:",
      processedBuffer.length,
      "bytes",
    );

    // ── 8. Upload to S3 ──────────────────────────────────────────────
    const sanitizedName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const key = `blog-inline/${uuidv4()}-${sanitizedName}.webp`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: processedBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("[Inline Upload] S3 complete:", fileUrl);

    return { fileUrl };
  } catch (error) {
    console.error("[uploadInlineBlogImage] Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to process and upload inline image",
    );
  }
}