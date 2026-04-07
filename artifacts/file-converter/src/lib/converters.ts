import { PDFDocument, rgb } from "pdf-lib";

export type ConversionResult = {
  blob: Blob;
  filename: string;
  mimeType: string;
};

// ─── Image → Image (Canvas API) ─────────────────────────────────────────────

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

async function imageToFormat(
  file: File,
  format: "image/jpeg" | "image/png" | "image/webp",
  quality = 0.92
): Promise<ConversionResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;

  // Fill white for JPEG (no transparency)
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        const ext = format.split("/")[1].replace("jpeg", "jpg");
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        resolve({ blob, filename: `${baseName}.${ext}`, mimeType: format });
      },
      format,
      quality
    );
  });
}

export async function jpgToPng(file: File) {
  return imageToFormat(file, "image/png");
}

export async function pngToJpg(file: File) {
  return imageToFormat(file, "image/jpeg");
}

export async function jpgToWebp(file: File) {
  return imageToFormat(file, "image/webp");
}

export async function webpToPng(file: File) {
  return imageToFormat(file, "image/png");
}

export async function webpToJpg(file: File) {
  return imageToFormat(file, "image/jpeg");
}

export async function pngToWebp(file: File) {
  return imageToFormat(file, "image/webp");
}

// ─── Image → PDF ─────────────────────────────────────────────────────────────

export async function imageToPdf(file: File): Promise<ConversionResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const base64 = dataUrl.split(",")[1];
  const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const pdfDoc = await PDFDocument.create();
  const jpgImage = await pdfDoc.embedJpg(imgBytes);
  const { width, height } = jpgImage;

  const page = pdfDoc.addPage([width, height]);
  page.drawImage(jpgImage, { x: 0, y: 0, width, height });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return { blob, filename: `${baseName}.pdf`, mimeType: "application/pdf" };
}

// ─── TXT → PDF ───────────────────────────────────────────────────────────────

export async function txtToPdf(file: File): Promise<ConversionResult> {
  const text = await file.text();
  const pdfDoc = await PDFDocument.create();

  const fontSize = 11;
  const margin = 50;
  const lineHeight = fontSize * 1.5;
  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.55));

  const rawLines = text.split("\n");
  const wrappedLines: string[] = [];

  for (const line of rawLines) {
    if (line.length === 0) {
      wrappedLines.push("");
      continue;
    }
    let remaining = line;
    while (remaining.length > charsPerLine) {
      const breakAt = remaining.lastIndexOf(" ", charsPerLine) || charsPerLine;
      wrappedLines.push(remaining.slice(0, breakAt));
      remaining = remaining.slice(breakAt).trimStart();
    }
    wrappedLines.push(remaining);
  }

  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  const totalPages = Math.ceil(wrappedLines.length / linesPerPage);

  for (let p = 0; p < totalPages; p++) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const pageLines = wrappedLines.slice(p * linesPerPage, (p + 1) * linesPerPage);

    pageLines.forEach((line, i) => {
      page.drawText(line, {
        x: margin,
        y: pageHeight - margin - i * lineHeight,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return { blob, filename: `${baseName}.pdf`, mimeType: "application/pdf" };
}

// ─── PDF → Images ─────────────────────────────────────────────────────────────

export async function pdfToImages(
  file: File,
  format: "image/jpeg" | "image/png" = "image/jpeg",
  onProgress?: (page: number, total: number) => void
): Promise<ConversionResult[]> {
  // Dynamically load pdf.js from CDN
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const results: ConversionResult[] = [];
  const ext = format === "image/jpeg" ? "jpg" : "png";
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(i, pdf.numPages);
    const pdfPage = await pdf.getPage(i);
    const scale = 2.0;
    const viewport = pdfPage.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await pdfPage.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        format,
        0.92
      );
    });

    const suffix = pdf.numPages > 1 ? `-page${i}` : "";
    results.push({ blob, filename: `${baseName}${suffix}.${ext}`, mimeType: format });
  }

  return results;
}
