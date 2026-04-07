import { Download, Check } from "lucide-react";
import { useState } from "react";
import type { ConversionResult } from "@/lib/converters";

interface OutputPreviewProps {
  results: ConversionResult[];
  onReset: () => void;
}

function DownloadButton({ result }: { result: ConversionResult }) {
  const [clicked, setClicked] = useState(false);

  const handleDownload = () => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card animate-fade-in">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg border border-border bg-secondary flex items-center justify-center shrink-0">
          <span className="text-[9px] font-semibold text-primary">
            {result.filename.split(".").pop()?.toUpperCase().slice(0, 4)}
          </span>
        </div>
        <p className="text-sm text-foreground truncate">{result.filename}</p>
      </div>
      <button
        onClick={handleDownload}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ml-3
          transition-all duration-300
          ${clicked
            ? "bg-primary/20 text-primary border border-primary/30"
            : "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105"}
        `}
      >
        {clicked ? <Check size={12} /> : <Download size={12} />}
        {clicked ? "Saved!" : "Download"}
      </button>
    </div>
  );
}

export function OutputPreview({ results, onReset }: OutputPreviewProps) {
  const isImage = results.some((r) => r.mimeType.startsWith("image/"));
  const firstImage = isImage ? results[0] : null;
  const [previewUrl] = useState(() =>
    firstImage ? URL.createObjectURL(firstImage.blob) : null
  );

  const downloadAll = () => {
    results.forEach((result, i) => {
      setTimeout(() => {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        a.click();
        URL.revokeObjectURL(url);
      }, i * 200);
    });
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Image preview */}
      {previewUrl && (
        <div className="w-full rounded-xl border border-border overflow-hidden bg-card">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-64 object-contain"
          />
        </div>
      )}

      {/* File list */}
      <div className="space-y-2">
        {results.map((r) => (
          <DownloadButton key={r.filename} result={r} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {results.length > 1 && (
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-300 hover:scale-105"
          >
            <Download size={14} />
            Download all ({results.length})
          </button>
        )}
        <button
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-300"
        >
          Convert another
        </button>
      </div>
    </div>
  );
}
