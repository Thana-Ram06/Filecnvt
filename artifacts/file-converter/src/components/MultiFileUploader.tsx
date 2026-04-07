import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Plus } from "lucide-react";

interface MultiFileUploaderProps {
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExt(file: File): string {
  return file.name.split(".").pop()?.toUpperCase().slice(0, 4) ?? "FILE";
}

export function MultiFileUploader({ accept, files, onFiles, onRemove, onClear }: MultiFileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    onFiles([...files, ...Array.from(newFiles)]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  if (files.length > 0) {
    return (
      <div className="w-full space-y-2 animate-fade-in">
        {files.map((file, i) => (
          <div
            key={`${file.name}-${i}`}
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg border border-border bg-secondary flex items-center justify-center shrink-0">
                <span className="text-[9px] font-semibold text-primary">{getFileExt(file)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 ml-2 shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add more + Clear */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => addRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
          >
            <Plus size={12} />
            Add more files
          </button>
          <button
            onClick={onClear}
            className="px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Clear all
          </button>
        </div>
        <input ref={addRef} type="file" accept={accept} multiple onChange={handleChange} className="hidden" />
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
        <p className="text-sm font-medium text-foreground">Drop files here</p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse · select multiple</p>
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple onChange={handleChange} className="hidden" />
    </div>
  );
}
