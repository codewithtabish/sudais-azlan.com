"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Environment validation (fail fast on startup if anything is missing)
// ═══════════════════════════════════════════════════════════════════════════════
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const AWS_REGION = getRequiredEnv("AWS_REGION");
const AWS_ACCESS_KEY_ID = getRequiredEnv("AWS_ACCESS_KEY_ID");
const AWS_SECRET_ACCESS_KEY = getRequiredEnv("AWS_SECRET_ACCESS_KEY");
const AWS_S3_BUCKET_NAME = getRequiredEnv("AWS_S3_BUCKET_NAME");
const WATERMARK_URL = getRequiredEnv("WATERMARK_URL");

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Constants
// ═══════════════════════════════════════════════════════════════════════════════
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Watermark loader — fetched from a reliable URL, cached in memory
//    (safe for Vercel/serverless; no fs or process.cwd() needed)
// ═══════════════════════════════════════════════════════════════════════════════
let cachedWatermarkBuffer: Buffer | null = null;

async function getOriginalWatermarkBuffer(): Promise<Buffer> {
  if (cachedWatermarkBuffer) {
    return cachedWatermarkBuffer;
  }

  const response = await fetch(WATERMARK_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch watermark from WATERMARK_URL: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Validate the watermark is a readable image before caching
  await sharp(buffer).metadata();

  cachedWatermarkBuffer = buffer;
  return buffer;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Watermark processing helpers
// ═══════════════════════════════════════════════════════════════════════════════
async function resizeWatermark(
  originalWatermarkBuffer: Buffer,
  targetImageWidth: number,
  targetImageHeight: number
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

  return sharp(originalWatermarkBuffer)
    .resize(targetWidth, targetHeight, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .png() // keep transparency
    .toBuffer();
}

async function applyWatermarkOpacity(
  watermarkBuffer: Buffer,
  opacity: number
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

async function padWatermarkForTopOffset(
  watermarkBuffer: Buffer,
  imageWidth: number,
  imageHeight: number,
  topOffset: number
): Promise<Buffer> {
  const wmMeta = await sharp(watermarkBuffer).metadata();
  const wmWidth = wmMeta.width ?? 1;
  const wmHeight = wmMeta.height ?? 1;

  const canvasHeight = Math.min(wmHeight + topOffset, imageHeight);
  const canvasWidth = imageWidth;

  const left = Math.round((canvasWidth - wmWidth) / 2);
  const top = topOffset;

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

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Return type — never throw in production; always return a structured result
// ═══════════════════════════════════════════════════════════════════════════════
export type UploadOgResult =
  | { success: true; fileUrl: string }
  | { success: false; error: string };

/**
 * Upload a watermarked Open Graph (OG) image to S3.
 *
 * Pipeline:
 * 1. Extract file from FormData (duck-typed, no instanceof)
 * 2. Validate file size (≤ 10 MB)
 * 3. Validate image via sharp (auto-rotate via EXIF)
 * 4. Force resize to exactly 1200 × 630 (fit: "cover", attention strategy)
 * 5. Fetch & resize watermark proportionally (~75% of image width)
 * 6. Apply 15% opacity
 * 7. Pad watermark with 40 px top offset
 * 8. Composite watermark at upper-center (gravity: "north")
 * 9. Convert to WebP (quality 82, effort 6) — metadata stripped by default
 * 10. Upload to S3
 * 11. Return { success: true, fileUrl } or { success: false, error }
 */
export async function uploadWatermarkedOgImage(
  formData: FormData
): Promise<UploadOgResult> {
  try {
    // ── 1. Extract file from FormData ─────────────────────────────────
    const file = formData.get("file");

    // Duck-type check: avoids `instanceof File` which breaks across realms
    if (
      !file ||
      typeof file !== "object" ||
      file === null ||
      typeof (file as { arrayBuffer?: unknown }).arrayBuffer !== "function"
    ) {
      return { success: false, error: "No valid file received" };
    }

    const fileLike = file as {
      name?: string;
      type?: string;
      size?: number;
      arrayBuffer: () => Promise<ArrayBuffer>;
    };

    // ── 2. Enforce 10 MB max file size (early exit if size is exposed) ─
    if (typeof fileLike.size === "number" && fileLike.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: `File is too large. Maximum allowed size is 10 MB.`,
      };
    }

    const arrayBuffer = await fileLike.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    if (inputBuffer.length === 0) {
      return { success: false, error: "Input file is empty" };
    }

    if (inputBuffer.length > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (inputBuffer.length / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `File is too large (${sizeMB} MB). Maximum allowed size is 10 MB.`,
      };
    }

    // ── 3. Validate image and auto-rotate via EXIF ────────────────────
    let rotatedBuffer: Buffer;
    try {
      rotatedBuffer = await sharp(inputBuffer).rotate().toBuffer();
    } catch {
      return {
        success: false,
        error: "Invalid image file. Please upload a valid image format (JPEG, PNG, WebP, etc.).",
      };
    }

    const rotatedMeta = await sharp(rotatedBuffer).metadata();
    const originalWidth = rotatedMeta.width ?? 0;
    const originalHeight = rotatedMeta.height ?? 0;

    if (!originalWidth || !originalHeight) {
      return { success: false, error: "Unable to read image dimensions" };
    }

    // ── 4. Force resize to exactly 1200 × 630 ──────────────────────────
    let resizedBuffer: Buffer;
    try {
      resizedBuffer = await sharp(rotatedBuffer)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .toBuffer();
    } catch {
      return { success: false, error: "Failed to resize image to OG dimensions" };
    }

    // ── 5. Load watermark from URL ────────────────────────────────────
    let originalWatermarkBuffer: Buffer;
    try {
      originalWatermarkBuffer = await getOriginalWatermarkBuffer();
    } catch (err) {
      console.error("[Watermark] Load failed:", err);
      return {
        success: false,
        error: "Server configuration error: unable to load watermark",
      };
    }

    // ── 6. Resize watermark ───────────────────────────────────────────
    let watermarkResizedBuffer: Buffer;
    try {
      watermarkResizedBuffer = await resizeWatermark(
        originalWatermarkBuffer,
        OG_WIDTH,
        OG_HEIGHT
      );
    } catch {
      return { success: false, error: "Failed to resize watermark" };
    }

    // ── 7. Apply premium opacity (15%) ────────────────────────────────
    const OPACITY = 0.15;
    let watermarkFadedBuffer: Buffer;
    try {
      watermarkFadedBuffer = await applyWatermarkOpacity(
        watermarkResizedBuffer,
        OPACITY
      );
    } catch {
      return { success: false, error: "Failed to apply watermark opacity" };
    }

    // ── 8. Pad watermark with transparent top offset ──────────────────
    const TOP_OFFSET = 40;
    let paddedWatermarkBuffer: Buffer;
    try {
      paddedWatermarkBuffer = await padWatermarkForTopOffset(
        watermarkFadedBuffer,
        OG_WIDTH,
        OG_HEIGHT,
        TOP_OFFSET
      );
    } catch {
      return { success: false, error: "Failed to position watermark" };
    }

    // ── 9. Composite watermark and convert to WebP ────────────────────
    //    Sharp strips all metadata/EXIF by default when .withMetadata() is omitted.
    let watermarkedBuffer: Buffer;
    try {
      watermarkedBuffer = await sharp(resizedBuffer)
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
        .toBuffer();
    } catch {
      return { success: false, error: "Failed to composite final image" };
    }

    // ── 10. Upload processed buffer to S3 ─────────────────────────────
    const sanitizedName = (fileLike.name || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const key = `euro/og-images/${uuidv4()}-${sanitizedName}.webp`;

    try {
      const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: watermarkedBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      });

      await s3.send(command);
    } catch (err) {
      console.error("[S3] Upload error:", err);
      return { success: false, error: "Failed to upload image to storage" };
    }

    const fileUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    return { success: true, fileUrl };
  } catch (error) {
    console.error("[uploadWatermarkedOgImage] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}