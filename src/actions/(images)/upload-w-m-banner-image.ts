"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

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

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const BANNER_WIDTH = 1920;
const BANNER_HEIGHT = 1080;

let cachedWatermarkBuffer: Buffer | null = null;

async function getOriginalWatermarkBuffer(): Promise<Buffer> {
  if (cachedWatermarkBuffer) return cachedWatermarkBuffer;

  const response = await fetch(WATERMARK_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch watermark: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await sharp(buffer).metadata(); // validate it's an image

  cachedWatermarkBuffer = buffer;
  return buffer;
}

async function resizeWatermark(
  originalWatermarkBuffer: Buffer,
  targetImageWidth: number,
  targetImageHeight: number
): Promise<Buffer> {
  const wmMeta = await sharp(originalWatermarkBuffer).metadata();
  const wmOriginalWidth = wmMeta.width ?? 500;
  const wmOriginalHeight = wmMeta.height ?? 200;

  let targetWidth = Math.round(targetImageWidth * 0.75);
  targetWidth = Math.min(targetWidth, targetImageWidth);

  const aspectRatio = wmOriginalHeight / wmOriginalWidth;
  let targetHeight = Math.round(targetWidth * aspectRatio);

  if (targetHeight > targetImageHeight) {
    targetHeight = targetImageHeight;
    targetWidth = Math.round(targetHeight / aspectRatio);
  }

  targetWidth = Math.min(targetWidth, targetImageWidth);
  targetHeight = Math.min(targetHeight, targetImageHeight);

  return sharp(originalWatermarkBuffer)
    .resize(targetWidth, targetHeight, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
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

  const channels = info.channels;
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

export type UploadResult =
  | { success: true; fileUrl: string }
  | { success: false; error: string };

export async function uploadWatermarkedImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    const file = formData.get("file");

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

    if (typeof fileLike.size === "number" && fileLike.size > MAX_FILE_SIZE_BYTES) {
      return { success: false, error: "File is too large. Maximum allowed size is 8 MB." };
    }

    const arrayBuffer = await fileLike.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    if (inputBuffer.length === 0) {
      return { success: false, error: "Input file is empty" };
    }

    if (inputBuffer.length > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (inputBuffer.length / (1024 * 1024)).toFixed(2);
      return { success: false, error: `File is too large (${sizeMB} MB). Maximum allowed size is 8 MB.` };
    }

    let rotatedBuffer: Buffer;
    try {
      rotatedBuffer = await sharp(inputBuffer).rotate().toBuffer();
    } catch {
      return { success: false, error: "Invalid image file. Please upload a valid image format." };
    }

    const rotatedMeta = await sharp(rotatedBuffer).metadata();
    if (!rotatedMeta.width || !rotatedMeta.height) {
      return { success: false, error: "Unable to read image dimensions" };
    }

    let resizedBuffer: Buffer;
    try {
      resizedBuffer = await sharp(rotatedBuffer)
        .resize(BANNER_WIDTH, BANNER_HEIGHT, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .toBuffer();
    } catch {
      return { success: false, error: "Failed to resize image to banner dimensions" };
    }

    let originalWatermarkBuffer: Buffer;
    try {
      originalWatermarkBuffer = await getOriginalWatermarkBuffer();
    } catch {
      return { success: false, error: "Server configuration error: unable to load watermark" };
    }

    let watermarkResizedBuffer: Buffer;
    try {
      watermarkResizedBuffer = await resizeWatermark(
        originalWatermarkBuffer,
        BANNER_WIDTH,
        BANNER_HEIGHT
      );
    } catch {
      return { success: false, error: "Failed to resize watermark" };
    }

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

    const TOP_OFFSET = 60;
    let paddedWatermarkBuffer: Buffer;
    try {
      paddedWatermarkBuffer = await padWatermarkForTopOffset(
        watermarkFadedBuffer,
        BANNER_WIDTH,
        BANNER_HEIGHT,
        TOP_OFFSET
      );
    } catch {
      return { success: false, error: "Failed to position watermark" };
    }

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
        .webp({ quality: 82, effort: 6 })
        .toBuffer();
    } catch {
      return { success: false, error: "Failed to composite final image" };
    }

    const sanitizedName = (fileLike.name || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-]/g, "-");

    const key = `euro/blog-covers/${uuidv4()}-${sanitizedName}.webp`;

    try {
      const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: watermarkedBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000",
      });
      await s3.send(command);
    } catch {
      return { success: false, error: "Failed to upload image to storage" };
    }

    const fileUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    return { success: true, fileUrl };
  } catch {
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}