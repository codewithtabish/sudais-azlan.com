"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ── Watermark path ──────────────────────────────────────────────────────
const watermarkPath = path.join(
  process.cwd(),
  "public",
  "logos",
  "watermark_two.png",
);

/**
 * Load the original watermark PNG from disk.
 * Throws if the file does not exist.
 */
async function getOriginalWatermarkBuffer(): Promise<Buffer> {
  if (!fs.existsSync(watermarkPath)) {
    throw new Error(
      `Watermark file not found at: ${watermarkPath}. ` +
        `Please ensure public/logos/watermark_two.png exists.`,
    );
  }

  return fs.promises.readFile(watermarkPath);
}

/**
 * Resize the watermark proportionally to fit the target image.
 * The watermark will be ~75% of the image width (luxury dealership style).
 * Never larger than the image. Preserves aspect ratio. Keeps PNG transparency.
 */
async function resizeWatermark(
  originalWatermarkBuffer: Buffer,
  targetImageWidth: number,
  targetImageHeight: number,
): Promise<Buffer> {
  const wmMeta = await sharp(originalWatermarkBuffer).metadata();
  const wmOriginalWidth = wmMeta.width ?? 500;
  const wmOriginalHeight = wmMeta.height ?? 200;

  // Target watermark width: 75% of image width
  let targetWidth = Math.round(targetImageWidth * 0.75);
  targetWidth = Math.min(targetWidth, targetImageWidth);

  // Preserve aspect ratio
  const aspectRatio = wmOriginalHeight / wmOriginalWidth;
  let targetHeight = Math.round(targetWidth * aspectRatio);

  // Clamp height if needed
  if (targetHeight > targetImageHeight) {
    targetHeight = targetImageHeight;
    targetWidth = Math.round(targetHeight / aspectRatio);
  }

  // Final safety clamps
  targetWidth = Math.min(targetWidth, targetImageWidth);
  targetHeight = Math.min(targetHeight, targetImageHeight);

  console.log(
    "[Watermark] Original:",
    wmOriginalWidth,
    "x",
    wmOriginalHeight,
    "→ Resized:",
    targetWidth,
    "x",
    targetHeight,
  );

  return sharp(originalWatermarkBuffer)
    .resize(targetWidth, targetHeight, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .png() // keep transparency
    .toBuffer();
}

/**
 * Apply opacity to the watermark by modifying the alpha channel.
 * Opacity: 15% (0.15) for premium subtle branding.
 */
async function applyWatermarkOpacity(
  watermarkBuffer: Buffer,
  opacity: number,
): Promise<Buffer> {
  const { data, info } = await sharp(watermarkBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // should be 4 (RGBA)
  const pixelCount = info.width * info.height;

  for (let i = 0; i < pixelCount; i++) {
    const alphaIndex = i * channels + 3;
    data[alphaIndex] = Math.round(data[alphaIndex] * opacity);
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer();
}

/**
 * Pad the watermark with transparent space at the top so it sits
 * ~40 px down from the top edge when using gravity: "north".
 */
async function padWatermarkForTopOffset(
  watermarkBuffer: Buffer,
  imageWidth: number,
  imageHeight: number,
  topOffset: number,
): Promise<Buffer> {
  const wmMeta = await sharp(watermarkBuffer).metadata();
  const wmWidth = wmMeta.width ?? 1;
  const wmHeight = wmMeta.height ?? 1;

  const canvasHeight = Math.min(wmHeight + topOffset, imageHeight);
  const canvasWidth = imageWidth;

  const left = Math.round((canvasWidth - wmWidth) / 2);
  const top = topOffset;

  console.log(
    "[Watermark] Canvas:",
    canvasWidth,
    "x",
    canvasHeight,
    "| placed at",
    left,
    ",",
    top,
  );

  return sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: watermarkBuffer,
        left: Math.max(0, left),
        top: Math.max(0, top),
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Upload a watermarked Open Graph (OG) image to S3.
 *
 * Pipeline:
 * 1. Validate MIME type
 * 2. Validate upload size (max 10 MB)
 * 3. Validate image can be decoded by Sharp
 * 4. Auto-rotate via EXIF
 * 5. Validate minimum resolution (1200 × 630)
 * 6. Force resize to exactly 1200 × 630 (fit: "cover", attention strategy)
 *    – any aspect ratio is accepted; we crop/resize to the required OG size
 * 7. Resize watermark proportionally (~75% of image width)
 * 8. Apply 15% opacity
 * 9. Pad watermark with 40 px top offset
 * 10. Composite watermark at upper-center (gravity: "north")
 * 11. Convert to WebP (quality 82, effort 6)
 * 12. Strip all metadata (default Sharp behaviour)
 * 13. Save debug-og.webp locally
 * 14. Upload to S3
 * 15. Return S3 URL
 */
export async function uploadWatermarkedOgImage(
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
    ];

    if (!allowedMimeTypes.includes(fileType)) {
      throw new Error(
        "Unsupported image format.\n\nPlease upload a JPEG, PNG, WebP, or AVIF image.",
      );
    }

    // ── 2. Validate upload size (max 10 MB) ────────────────────────────
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    if (fileData.length > MAX_SIZE_BYTES) {
      throw new Error("Image exceeds the maximum upload size of 10 MB.");
    }

    // ── 3. Convert incoming data to Buffer ─────────────────────────────
    const inputBuffer = Buffer.from(fileData);

    if (inputBuffer.length === 0) {
      throw new Error("Input file is empty");
    }

    console.log(
      "[Upload] Received file:",
      fileName,
      "| Type:",
      fileType,
      "| Size:",
      inputBuffer.length,
      "bytes",
    );

    // ── 4. Validate image can be decoded by Sharp ──────────────────────
    try {
      await sharp(inputBuffer).metadata();
    } catch {
      throw new Error("Invalid image file.");
    }

    // ── 5. Load original watermark ─────────────────────────────────────
    const originalWatermarkBuffer = await getOriginalWatermarkBuffer();
    console.log("[Upload] Watermark loaded from:", watermarkPath);

    // ── 6. Auto-rotate image based on EXIF ─────────────────────────────
    const rotatedBuffer = await sharp(inputBuffer).rotate().toBuffer();

    const rotatedMeta = await sharp(rotatedBuffer).metadata();
    const originalWidth = rotatedMeta.width ?? 0;
    const originalHeight = rotatedMeta.height ?? 0;

    if (!originalWidth || !originalHeight) {
      throw new Error("Unable to read image dimensions");
    }

    console.log(
      "[Upload] Image dimensions after rotation:",
      originalWidth,
      "x",
      originalHeight,
    );

    // ── 7. Validate minimum resolution ─────────────────────────────────
    const MIN_WIDTH = 1200;
    const MIN_HEIGHT = 630;

    if (originalWidth < MIN_WIDTH || originalHeight < MIN_HEIGHT) {
      throw new Error(
        "Image resolution is too low.\n\nMinimum size:\n1200 × 630 pixels.",
      );
    }

    // ── 8. Force resize to exactly 1200 × 630 ──────────────────────────
    // Any aspect ratio is now accepted. We always output the required OG size.
    // fit: "cover" + attention strategy keeps the most important area visible.
    const OG_WIDTH = 1200;
    const OG_HEIGHT = 630;

    const resizedBuffer = await sharp(rotatedBuffer)
      .resize(OG_WIDTH, OG_HEIGHT, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
      .toBuffer();

    const finalWidth = OG_WIDTH;
    const finalHeight = OG_HEIGHT;

    console.log(
      "[Upload] Final OG dimensions:",
      finalWidth,
      "x",
      finalHeight,
    );

    // ── 9. Resize watermark to fit the final image ─────────────────────
    const watermarkResizedBuffer = await resizeWatermark(
      originalWatermarkBuffer,
      finalWidth,
      finalHeight,
    );

    // ── 10. Apply premium opacity (15%) ────────────────────────────────
    const OPACITY = 0.15;
    const watermarkFadedBuffer = await applyWatermarkOpacity(
      watermarkResizedBuffer,
      OPACITY,
    );
    console.log("[Upload] Watermark opacity applied:", OPACITY * 100 + "%");

    // ── 11. Pad watermark with transparent top offset ──────────────────
    const TOP_OFFSET = 40;
    const paddedWatermarkBuffer = await padWatermarkForTopOffset(
      watermarkFadedBuffer,
      finalWidth,
      finalHeight,
      TOP_OFFSET,
    );
    console.log(
      "[Upload] Watermark padded with top offset:",
      TOP_OFFSET + "px",
    );

    // ── 12. Composite watermark onto image (upper-center) ──────────────
    const watermarkedBuffer = await sharp(resizedBuffer)
      .composite([
        {
          input: paddedWatermarkBuffer,
          gravity: "north",
          blend: "over",
        },
      ])
      .webp({
        quality: 82,
        effort: 6,
      })
      .toBuffer(); // metadata is stripped by default

    console.log("[Upload] Watermark composited successfully at north");

    // ── 13. Save debug file locally ────────────────────────────────────
    const debugPath = path.join(process.cwd(), "debug-og.webp");
    await fs.promises.writeFile(debugPath, watermarkedBuffer);
    console.log("[Upload] Debug file saved to:", debugPath);

    // ── 14. Upload processed buffer to S3 ──────────────────────────────
    const sanitizedName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const key = `euro/og-images/${uuidv4()}-${sanitizedName}.webp`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: watermarkedBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("[Upload] S3 upload complete:", fileUrl);

    return { fileUrl };
  } catch (error) {
    console.error("[uploadWatermarkedOgImage] Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to process and upload OG image",
    );
  }
}