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
 * ~60 px down from the top edge when using gravity: "north".
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
 * Upload a watermarked image to S3.
 *
 * Pipeline:
 * 1. Receive image as number[] (Server Action compatible)
 * 2. Auto-rotate via EXIF
 * 3. Force resize to exactly 1920 × 1080 (banner size)
 * 4. Resize watermark proportionally (~75% of image width)
 * 5. Apply 15% opacity
 * 6. Pad watermark with ~60 px top offset
 * 7. Composite watermark at upper-center (gravity: "north")
 * 8. Convert to WebP quality 90
 * 9. Strip EXIF
 * 10. Save debug.webp locally
 * 11. Upload to S3
 * 12. Return S3 URL
 */
export async function uploadWatermarkedImage(
  fileData: number[],
  fileType: string,
  fileName: string,
): Promise<{ fileUrl: string }> {
  try {
    // ── 1. Convert incoming data to Buffer ─────────────────────────────
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

    // ── 2. Load original watermark ─────────────────────────────────────
    const originalWatermarkBuffer = await getOriginalWatermarkBuffer();
    console.log("[Upload] Watermark loaded from:", watermarkPath);

    // ── 3. Auto-rotate image based on EXIF ────────────────────────────
    const rotatedBuffer = await sharp(inputBuffer).rotate().toBuffer();

    // ── 4. Force resize to exactly 1920 × 1080 (banner size) ──────────
    // Using "cover" so the image always fills 1920×1080 (may crop)
    // Change to "contain" + background if you prefer letterboxing instead
    const BANNER_WIDTH = 1920;
    const BANNER_HEIGHT = 1080;

    const resizedBuffer = await sharp(rotatedBuffer)
      .resize(BANNER_WIDTH, BANNER_HEIGHT, {
        fit: "cover",
        position: "centre",
      })
      .toBuffer();

    const finalWidth = BANNER_WIDTH;
    const finalHeight = BANNER_HEIGHT;

    console.log(
      "[Upload] Final banner dimensions:",
      finalWidth,
      "x",
      finalHeight,
    );

    // ── 5. Resize watermark to fit the final image ────────────────────
    const watermarkResizedBuffer = await resizeWatermark(
      originalWatermarkBuffer,
      finalWidth,
      finalHeight,
    );

    // ── 6. Apply premium opacity (15%) ─────────────────────────────────
    const OPACITY = 0.15;
    const watermarkFadedBuffer = await applyWatermarkOpacity(
      watermarkResizedBuffer,
      OPACITY,
    );
    console.log("[Upload] Watermark opacity applied:", OPACITY * 100 + "%");

    // ── 7. Pad watermark with transparent top offset ──────────────────
    const TOP_OFFSET = 60;
    const paddedWatermarkBuffer = await padWatermarkForTopOffset(
      watermarkFadedBuffer,
      finalWidth,
      finalHeight,
      TOP_OFFSET,
    );
    console.log("[Upload] Watermark padded with top offset:", TOP_OFFSET + "px");

    // ── 8. Composite watermark onto image (upper-center) ──────────────
    const watermarkedBuffer = await sharp(resizedBuffer)
      .composite([
        {
          input: paddedWatermarkBuffer,
          gravity: "north",
          blend: "over",
        },
      ])
      .webp({
        quality: 90,
        effort: 4,
      })
      .withMetadata({}) // strip all metadata / EXIF
      .toBuffer();

    console.log("[Upload] Watermark composited successfully at north");

    // ── 9. Save debug file locally ────────────────────────────────────
    const debugPath = path.join(process.cwd(), "debug.webp");
    await fs.promises.writeFile(debugPath, watermarkedBuffer);
    console.log("[Upload] Debug file saved to:", debugPath);

    // ── 10. Upload processed buffer to S3 ─────────────────────────────
    const sanitizedName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-]/g, "-");

    const key = `euro/blog-covers/${uuidv4()}-${sanitizedName}.webp`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: watermarkedBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000",
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("[Upload] S3 upload complete:", fileUrl);

    return { fileUrl };
  } catch (error) {
    console.error("[uploadWatermarkedImage] Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to process and upload image",
    );
  }
}