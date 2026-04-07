import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileUploader } from "@/components/FileUploader";
import { OutputPreview } from "@/components/OutputPreview";
import { getTool } from "@/lib/tools";
import type { ConversionResult } from "@/lib/converters";
import { ArrowRight, ChevronLeft, Loader } from "lucide-react";

type State = "idle" | "converting" | "done" | "error";

export function ToolPage() {
  const { tool: toolId } = useParams<{ tool: string }>();
  const [, navigate] = useLocation();
  const tool = getTool(toolId ?? "");

  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>("idle");
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="font-serif text-3xl">Tool not found</h1>
            <p className="text-muted-foreground text-sm">This tool doesn't exist.</p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              Back to home
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleConvert = async () => {
    if (!file) return;
    setState("converting");
    setError(null);
    setProgress(null);

    try {
      let out: ConversionResult | ConversionResult[];

      const {
        jpgToPng, pngToJpg, jpgToWebp, webpToPng, webpToJpg, pngToWebp,
        imageToPdf, txtToPdf, pdfToImages
      } = await import("@/lib/converters");

      switch (tool.id) {
        case "jpg-to-png":   out = await jpgToPng(file); break;
        case "png-to-jpg":   out = await pngToJpg(file); break;
        case "jpg-to-webp":  out = await jpgToWebp(file); break;
        case "webp-to-png":  out = await webpToPng(file); break;
        case "webp-to-jpg":  out = await webpToJpg(file); break;
        case "png-to-webp":  out = await pngToWebp(file); break;
        case "image-to-pdf": out = await imageToPdf(file); break;
        case "txt-to-pdf":   out = await txtToPdf(file); break;
        case "pdf-to-jpg":
          out = await pdfToImages(file, "image/jpeg", (p, t) => setProgress({ page: p, total: t }));
          break;
        case "pdf-to-png":
          out = await pdfToImages(file, "image/png", (p, t) => setProgress({ page: p, total: t }));
          break;
        default:
          throw new Error("Unknown tool");
      }

      setResults(Array.isArray(out) ? out : [out]);
      setState("done");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Conversion failed. Please try a different file.");
      setState("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults([]);
    setState("idle");
    setError(null);
    setProgress(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-14 space-y-8">
        {/* Breadcrumb */}
        <div className="animate-fade-in">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ChevronLeft size={13} />
            All tools
          </button>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up stagger-1 space-y-2">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl text-foreground">{tool.title}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <span className="px-2 py-1 rounded-md bg-secondary">{tool.from}</span>
              <ArrowRight size={12} />
              <span className="px-2 py-1 rounded-md bg-secondary text-primary">{tool.to}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{tool.description}</p>
        </div>

        {/* Privacy note */}
        <div className="animate-fade-in-up stagger-2 flex items-center gap-2 text-xs text-muted-foreground/70">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Files are processed locally in your browser — nothing is uploaded
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 animate-fade-in-up stagger-2" />

        {/* Main area */}
        {state === "done" ? (
          <OutputPreview results={results} onReset={handleReset} />
        ) : (
          <div className="space-y-5 animate-fade-in-up stagger-3">
            <FileUploader
              accept={tool.accept}
              onFile={setFile}
              currentFile={file}
              onClear={() => setFile(null)}
            />

            {error && (
              <div className="px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {state === "converting" && progress && (
              <div className="text-xs text-muted-foreground text-center">
                Processing page {progress.page} of {progress.total}…
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={!file || state === "converting"}
              className="
                w-full flex items-center justify-center gap-2 py-3 rounded-xl
                bg-primary text-primary-foreground font-medium text-sm
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:opacity-90 transition-all duration-300
                hover:enabled:scale-[1.01]
              "
            >
              {state === "converting" ? (
                <>
                  <Loader size={15} className="animate-spin-slow" />
                  Converting…
                </>
              ) : (
                <>
                  Convert to {tool.to}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 py-5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            Powered by{" "}
            <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">
              fileconv
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/60 backdrop-blur-sm bg-background/80">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
    </header>
  );
}
