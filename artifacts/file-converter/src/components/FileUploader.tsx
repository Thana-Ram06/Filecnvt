import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface FileUploaderProps {
  accept: string;
  onFile: (file: File) => void;
  currentFile: File | null;
  onClear: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mime: string): string {
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("image/")) return mime.split("/")[1].toUpperCase().slice(0, 4);
  if (mime === "text/plain") return "TXT";
  return "FILE";
}

export function FileUploader({ accept, onFile, currentFile, onClear }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  if (currentFile) {
    return (
      <div className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-card animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-border bg-secondary flex items-center justify-center">
            <span className="text-[10px] font-semibold text-primary">
              {getFileIcon(currentFile.type)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {currentFile.name}
            </p>
            <p className="text-xs text-muted-foreground">{formatBytes(currentFile.size)}</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        w-full flex flex-col items-center justify-center gap-3
        px-6 py-14 rounded-xl border-2 border-dashed cursor-pointer
        transition-all duration-300
        ${dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-card/60"}
      `}
    >
      <div className="w-11 h-11 rounded-xl border border-border bg-secondary flex items-center justify-center">
        <Upload size={18} className={`transition-colors duration-300 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Drop your file here
        </p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
