import JSZip from "jszip";
import type { ConversionResult } from "./converters";

/** Extract all files from a ZIP archive */
export async function extractZip(file: File): Promise<ConversionResult[]> {
  const zip = new JSZip();
  const content = await zip.loadAsync(await file.arrayBuffer());
  const results: ConversionResult[] = [];

  const fileEntries = Object.values(content.files).filter((f) => !f.dir);

  for (const entry of fileEntries) {
    const blob = await entry.async("blob");
    // Try to guess MIME type from extension
    const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeMap: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg", jpeg: "image/jpeg",
      png: "image/png", webp: "image/webp", gif: "image/gif",
      txt: "text/plain", csv: "text/csv",
      json: "application/json", html: "text/html",
      zip: "application/zip",
    };
    const mimeType = mimeMap[ext] ?? "application/octet-stream";
    // Use just the filename without path
    const filename = entry.name.split("/").pop() ?? entry.name;
    results.push({ blob, filename, mimeType });
  }

  if (results.length === 0) throw new Error("No files found in ZIP archive.");
  return results;
}

/** Create a ZIP archive from multiple files */
export async function createZip(files: File[]): Promise<ConversionResult> {
  const zip = new JSZip();
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    zip.file(file.name, buffer);
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return {
    blob: zipBlob,
    filename: "archive.zip",
    mimeType: "application/zip",
  };
}
