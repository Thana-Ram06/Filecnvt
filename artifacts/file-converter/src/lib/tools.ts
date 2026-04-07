export type ToolId =
  // Existing PDF
  | "pdf-to-jpg" | "pdf-to-png" | "image-to-pdf" | "txt-to-pdf"
  // New PDF
  | "pdf-merge" | "pdf-split" | "pdf-rotate" | "pdf-remove-pages" | "pdf-extract-pages"
  // Existing Image
  | "jpg-to-png" | "png-to-jpg" | "jpg-to-webp" | "webp-to-png" | "webp-to-jpg" | "png-to-webp"
  // New Image
  | "image-resize" | "image-compress" | "bulk-image-convert"
  // File
  | "extract-zip" | "create-zip"
  // Text
  | "json-format" | "json-to-csv" | "csv-to-json"
  | "base64-encode" | "base64-decode"
  | "url-encode" | "url-decode"
  | "text-case";

export type ToolCategory = "pdf" | "image" | "file" | "text";
export type InputType = "file" | "multi-file" | "text";

export interface ControlDef {
  id: string;
  label: string;
  type: "range" | "number" | "select" | "text-input";
  min?: number;
  max?: number;
  step?: number;
  default?: number | string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface Tool {
  id: ToolId;
  title: string;
  description: string;
  from: string;
  to: string;
  category: ToolCategory;
  accept?: string;
  inputType: InputType;
  controls?: ControlDef[];
}

export const TOOLS: Tool[] = [
  // ── PDF ──────────────────────────────────────────────────────────────
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert each PDF page into a high-quality JPG image",
    from: "PDF", to: "JPG", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "file",
  },
  {
    id: "pdf-to-png",
    title: "PDF to PNG",
    description: "Convert each PDF page into a lossless PNG image",
    from: "PDF", to: "PNG", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "file",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Wrap any JPG or PNG image into a PDF document",
    from: "JPG/PNG", to: "PDF", category: "pdf",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png", inputType: "file",
  },
  {
    id: "txt-to-pdf",
    title: "TXT to PDF",
    description: "Convert a plain text file into a clean PDF document",
    from: "TXT", to: "PDF", category: "pdf",
    accept: ".txt,text/plain", inputType: "file",
  },
  {
    id: "pdf-merge",
    title: "Merge PDFs",
    description: "Combine multiple PDF files into a single document",
    from: "PDFs", to: "PDF", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "multi-file",
  },
  {
    id: "pdf-split",
    title: "Split PDF",
    description: "Split a PDF into separate files by page range",
    from: "PDF", to: "PDFs", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "file",
    controls: [
      { id: "ranges", type: "text-input", label: "Page ranges", placeholder: "e.g. 1-3, 5, 7-9 (leave blank to split every page)" },
    ],
  },
  {
    id: "pdf-rotate",
    title: "Rotate PDF",
    description: "Rotate all or specific pages in a PDF",
    from: "PDF", to: "PDF", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "file",
    controls: [
      {
        id: "degrees", type: "select", label: "Rotation", default: "90",
        options: [
          { value: "90", label: "90° clockwise" },
          { value: "180", label: "180°" },
          { value: "270", label: "270° (90° counter-clockwise)" },
        ],
      },
      { id: "pages", type: "text-input", label: "Pages to rotate", placeholder: "e.g. 1, 3-5 (leave blank for all)" },
    ],
  },
  {
    id: "pdf-remove-pages",
    title: "Remove Pages",
    description: "Delete specific pages from a PDF",
    from: "PDF", to: "PDF", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "file",
    controls: [
      { id: "pages", type: "text-input", label: "Pages to remove", placeholder: "e.g. 2, 4-6, 8" },
    ],
  },
  {
    id: "pdf-extract-pages",
    title: "Extract Pages",
    description: "Extract a range of pages from a PDF into a new file",
    from: "PDF", to: "PDF", category: "pdf",
    accept: ".pdf,application/pdf", inputType: "file",
    controls: [
      { id: "pages", type: "text-input", label: "Pages to extract", placeholder: "e.g. 1-3, 5, 7-9" },
    ],
  },

  // ── IMAGE ──────────────────────────────────────────────────────────
  {
    id: "jpg-to-png",
    title: "JPG to PNG",
    description: "Convert JPEG images to lossless PNG format",
    from: "JPG", to: "PNG", category: "image",
    accept: ".jpg,.jpeg,image/jpeg", inputType: "file",
  },
  {
    id: "png-to-jpg",
    title: "PNG to JPG",
    description: "Convert PNG images to compressed JPEG format",
    from: "PNG", to: "JPG", category: "image",
    accept: ".png,image/png", inputType: "file",
  },
  {
    id: "jpg-to-webp",
    title: "JPG to WebP",
    description: "Convert JPEG to modern WebP for smaller file sizes",
    from: "JPG", to: "WebP", category: "image",
    accept: ".jpg,.jpeg,image/jpeg", inputType: "file",
  },
  {
    id: "webp-to-png",
    title: "WebP to PNG",
    description: "Convert WebP images to universal PNG format",
    from: "WebP", to: "PNG", category: "image",
    accept: ".webp,image/webp", inputType: "file",
  },
  {
    id: "webp-to-jpg",
    title: "WebP to JPG",
    description: "Convert WebP images to JPEG format",
    from: "WebP", to: "JPG", category: "image",
    accept: ".webp,image/webp", inputType: "file",
  },
  {
    id: "png-to-webp",
    title: "PNG to WebP",
    description: "Convert PNG to modern WebP for smaller file sizes",
    from: "PNG", to: "WebP", category: "image",
    accept: ".png,image/png", inputType: "file",
  },
  {
    id: "image-resize",
    title: "Resize Image",
    description: "Resize an image to specific dimensions",
    from: "Image", to: "Image", category: "image",
    accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp", inputType: "file",
    controls: [
      { id: "width", type: "number", label: "Width (px)", min: 1, max: 10000, default: 800 },
      { id: "height", type: "number", label: "Height (px)", min: 1, max: 10000, default: 600 },
    ],
  },
  {
    id: "image-compress",
    title: "Compress Image",
    description: "Reduce image file size with a quality slider",
    from: "Image", to: "Image", category: "image",
    accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp", inputType: "file",
    controls: [
      { id: "quality", type: "range", label: "Quality", min: 10, max: 100, step: 5, default: 70 },
    ],
  },
  {
    id: "bulk-image-convert",
    title: "Bulk Convert Images",
    description: "Convert multiple images to a single format at once",
    from: "Images", to: "Format", category: "image",
    accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp", inputType: "multi-file",
    controls: [
      {
        id: "format", type: "select", label: "Output format", default: "image/jpeg",
        options: [
          { value: "image/jpeg", label: "JPG" },
          { value: "image/png", label: "PNG" },
          { value: "image/webp", label: "WebP" },
        ],
      },
    ],
  },

  // ── FILE ──────────────────────────────────────────────────────────
  {
    id: "extract-zip",
    title: "Extract ZIP",
    description: "Extract files from a ZIP archive and download them",
    from: "ZIP", to: "Files", category: "file",
    accept: ".zip,application/zip,application/x-zip-compressed", inputType: "file",
  },
  {
    id: "create-zip",
    title: "Create ZIP",
    description: "Bundle multiple files into a single ZIP archive",
    from: "Files", to: "ZIP", category: "file",
    accept: "*", inputType: "multi-file",
  },

  // ── TEXT ──────────────────────────────────────────────────────────
  {
    id: "json-format",
    title: "JSON Formatter",
    description: "Pretty-print and validate JSON with syntax checking",
    from: "JSON", to: "JSON", category: "text", inputType: "text",
  },
  {
    id: "json-to-csv",
    title: "JSON to CSV",
    description: "Convert a JSON array of objects into CSV format",
    from: "JSON", to: "CSV", category: "text", inputType: "text",
  },
  {
    id: "csv-to-json",
    title: "CSV to JSON",
    description: "Convert CSV data into a JSON array of objects",
    from: "CSV", to: "JSON", category: "text", inputType: "text",
  },
  {
    id: "base64-encode",
    title: "Base64 Encode",
    description: "Encode text or content to Base64 format",
    from: "Text", to: "Base64", category: "text", inputType: "text",
  },
  {
    id: "base64-decode",
    title: "Base64 Decode",
    description: "Decode Base64 encoded strings back to text",
    from: "Base64", to: "Text", category: "text", inputType: "text",
  },
  {
    id: "url-encode",
    title: "URL Encode",
    description: "Encode special characters for use in URLs",
    from: "Text", to: "URL", category: "text", inputType: "text",
  },
  {
    id: "url-decode",
    title: "URL Decode",
    description: "Decode URL-encoded strings back to readable text",
    from: "URL", to: "Text", category: "text", inputType: "text",
  },
  {
    id: "text-case",
    title: "Text Case Converter",
    description: "Convert text between camelCase, snake_case, UPPER, lower, and Title Case",
    from: "Text", to: "Text", category: "text", inputType: "text",
    controls: [
      {
        id: "case", type: "select", label: "Target case", default: "upper",
        options: [
          { value: "upper", label: "UPPER CASE" },
          { value: "lower", label: "lower case" },
          { value: "title", label: "Title Case" },
          { value: "camel", label: "camelCase" },
          { value: "snake", label: "snake_case" },
          { value: "kebab", label: "kebab-case" },
          { value: "sentence", label: "Sentence case" },
        ],
      },
    ],
  },
];

export function getTool(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

/** Detect which tool category best matches a file's MIME type */
export function detectCategory(mime: string): ToolCategory | null {
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/zip" || mime === "application/x-zip-compressed" || mime === "application/octet-stream") return "file";
  if (mime === "text/plain") return "text";
  return null;
}
