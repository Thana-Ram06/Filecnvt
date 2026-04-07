export type ToolId =
  | "pdf-to-jpg"
  | "pdf-to-png"
  | "image-to-pdf"
  | "jpg-to-png"
  | "png-to-jpg"
  | "jpg-to-webp"
  | "webp-to-png"
  | "webp-to-jpg"
  | "png-to-webp"
  | "txt-to-pdf";

export type ToolCategory = "pdf" | "image";

export interface Tool {
  id: ToolId;
  title: string;
  description: string;
  from: string;
  to: string;
  category: ToolCategory;
  accept: string;
  multiple?: boolean;
}

export const TOOLS: Tool[] = [
  // PDF tools
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert each PDF page into a high-quality JPG image",
    from: "PDF",
    to: "JPG",
    category: "pdf",
    accept: ".pdf,application/pdf",
    multiple: false,
  },
  {
    id: "pdf-to-png",
    title: "PDF to PNG",
    description: "Convert each PDF page into a lossless PNG image",
    from: "PDF",
    to: "PNG",
    category: "pdf",
    accept: ".pdf,application/pdf",
    multiple: false,
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Wrap any JPG or PNG image into a PDF document",
    from: "JPG/PNG",
    to: "PDF",
    category: "pdf",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    multiple: false,
  },
  {
    id: "txt-to-pdf",
    title: "TXT to PDF",
    description: "Convert a plain text file into a clean PDF document",
    from: "TXT",
    to: "PDF",
    category: "pdf",
    accept: ".txt,text/plain",
    multiple: false,
  },
  // Image tools
  {
    id: "jpg-to-png",
    title: "JPG to PNG",
    description: "Convert JPEG images to lossless PNG format",
    from: "JPG",
    to: "PNG",
    category: "image",
    accept: ".jpg,.jpeg,image/jpeg",
    multiple: false,
  },
  {
    id: "png-to-jpg",
    title: "PNG to JPG",
    description: "Convert PNG images to compressed JPEG format",
    from: "PNG",
    to: "JPG",
    category: "image",
    accept: ".png,image/png",
    multiple: false,
  },
  {
    id: "jpg-to-webp",
    title: "JPG to WebP",
    description: "Convert JPEG to modern WebP for smaller file sizes",
    from: "JPG",
    to: "WebP",
    category: "image",
    accept: ".jpg,.jpeg,image/jpeg",
    multiple: false,
  },
  {
    id: "webp-to-png",
    title: "WebP to PNG",
    description: "Convert WebP images to universal PNG format",
    from: "WebP",
    to: "PNG",
    category: "image",
    accept: ".webp,image/webp",
    multiple: false,
  },
  {
    id: "webp-to-jpg",
    title: "WebP to JPG",
    description: "Convert WebP images to JPEG format",
    from: "WebP",
    to: "JPG",
    category: "image",
    accept: ".webp,image/webp",
    multiple: false,
  },
  {
    id: "png-to-webp",
    title: "PNG to WebP",
    description: "Convert PNG to modern WebP for smaller file sizes",
    from: "PNG",
    to: "WebP",
    category: "image",
    accept: ".png,image/png",
    multiple: false,
  },
];

export function getTool(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
