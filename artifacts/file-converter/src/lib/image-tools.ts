import type { ConversionResult } from "./converters";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

/** Resize an image to specified dimensions */
export async function imageResize(
  file: File,
  width: number,
  height: number
): Promise<ConversionResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const isJpeg = file.type === "image/jpeg";
  const mimeType = isJpeg ? "image/jpeg" : file.type.startsWith("image/") ? file.type : "image/png";
  const ext = mimeType.split("/")[1].replace("jpeg", "jpg");
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Resize failed"));
        resolve({ blob, filename: `${baseName}-${width}x${height}.${ext}`, mimeType });
      },
      mimeType,
      0.92
    );
  });
}

/** Compress an image with a quality value (10–100) */
export async function imageCompress(
  file: File,
  quality: number
): Promise<ConversionResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;

  // Always compress to JPEG for maximum size reduction; if original is PNG keep as PNG
  const isPng = file.type === "image/png";
  const mimeType = isPng ? "image/png" : "image/jpeg";
  const ext = isPng ? "png" : "jpg";

  if (!isPng) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  const q = quality / 100;
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Compress failed"));
        resolve({ blob, filename: `${baseName}-compressed.${ext}`, mimeType });
      },
      mimeType,
      q
    );
  });
}

/** Convert multiple images to a common format */
export async function bulkImageConvert(
  files: File[],
  targetMime: "image/jpeg" | "image/png" | "image/webp"
): Promise<ConversionResult[]> {
  const ext = targetMime.split("/")[1].replace("jpeg", "jpg");
  const results: ConversionResult[] = [];

  for (const file of files) {
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    if (targetMime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const baseName = file.name.replace(/\.[^/.]+$/, "");

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        targetMime,
        0.92
      );
    });

    results.push({ blob, filename: `${baseName}.${ext}`, mimeType: targetMime });
  }

  return results;
}
