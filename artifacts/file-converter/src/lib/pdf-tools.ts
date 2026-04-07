import { PDFDocument, degrees } from "pdf-lib";
import type { ConversionResult } from "./converters";

/** Parse a page range string like "1-3, 5, 7-9" → [0,1,2,4,6,7,8] (0-indexed) */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= totalPages) pages.add(i - 1);
      }
    } else {
      const n = Number(part);
      if (n >= 1 && n <= totalPages) pages.add(n - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

/** Merge multiple PDF files into one */
export async function pdfMerge(files: File[]): Promise<ConversionResult> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((p) => merged.addPage(p));
  }
  const pdfBytes = await merged.save();
  return {
    blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    filename: "merged.pdf",
    mimeType: "application/pdf",
  };
}

/** Split a PDF by page ranges, returning one PDF per range */
export async function pdfSplit(file: File, rangesStr: string): Promise<ConversionResult[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  // If no range, split every page
  const results: ConversionResult[] = [];
  if (!rangesStr.trim()) {
    for (let i = 0; i < total; i++) {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(src, [i]);
      doc.addPage(page);
      const pdfBytes = await doc.save();
      results.push({
        blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        filename: `${baseName}-page${i + 1}.pdf`,
        mimeType: "application/pdf",
      });
    }
    return results;
  }

  // Split by user-specified ranges
  const parts = rangesStr.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const pageIndices: number[] = [];
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= total) pageIndices.push(i - 1);
      }
    } else {
      const n = Number(part);
      if (n >= 1 && n <= total) pageIndices.push(n - 1);
    }
    if (pageIndices.length === 0) continue;
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(src, pageIndices);
    copied.forEach((p) => doc.addPage(p));
    const pdfBytes = await doc.save();
    results.push({
      blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      filename: `${baseName}-${part.replace(/\s/g, "")}.pdf`,
      mimeType: "application/pdf",
    });
  }
  return results;
}

/** Rotate pages in a PDF */
export async function pdfRotate(
  file: File,
  degreesVal: number,
  pagesStr: string
): Promise<ConversionResult> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const total = doc.getPageCount();
  const pageIndices = pagesStr.trim()
    ? parsePageRanges(pagesStr, total)
    : Array.from({ length: total }, (_, i) => i);

  for (const idx of pageIndices) {
    const page = doc.getPages()[idx];
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + degreesVal) % 360));
  }

  const pdfBytes = await doc.save();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    filename: `${baseName}-rotated.pdf`,
    mimeType: "application/pdf",
  };
}

/** Remove specific pages from a PDF */
export async function pdfRemovePages(file: File, pagesStr: string): Promise<ConversionResult> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();

  const toRemove = new Set(parsePageRanges(pagesStr, total));
  const toKeep = Array.from({ length: total }, (_, i) => i).filter((i) => !toRemove.has(i));

  if (toKeep.length === 0) throw new Error("Cannot remove all pages — at least one must remain.");

  const doc = await PDFDocument.create();
  const copied = await doc.copyPages(src, toKeep);
  copied.forEach((p) => doc.addPage(p));

  const pdfBytes = await doc.save();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    filename: `${baseName}-edited.pdf`,
    mimeType: "application/pdf",
  };
}

/** Extract specific pages into a new PDF */
export async function pdfExtractPages(file: File, pagesStr: string): Promise<ConversionResult> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();
  const pageIndices = parsePageRanges(pagesStr, total);

  if (pageIndices.length === 0) throw new Error("No valid pages specified.");

  const doc = await PDFDocument.create();
  const copied = await doc.copyPages(src, pageIndices);
  copied.forEach((p) => doc.addPage(p));

  const pdfBytes = await doc.save();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    filename: `${baseName}-extracted.pdf`,
    mimeType: "application/pdf",
  };
}
