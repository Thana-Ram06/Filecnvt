import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileUploader } from "@/components/FileUploader";
import { MultiFileUploader } from "@/components/MultiFileUploader";
import { OutputPreview } from "@/components/OutputPreview";
import { ToolControls } from "@/components/ToolControls";
import { TextToolPanel } from "@/components/TextToolPanel";
import { getTool } from "@/lib/tools";
import type { ConversionResult } from "@/lib/converters";
import { ArrowRight, ChevronLeft, Loader } from "lucide-react";

type State = "idle" | "converting" | "done" | "error";

export function ToolPage() {
  const { tool: toolId } = useParams<{ tool: string }>();
  const [, navigate] = useLocation();
  const tool = getTool(toolId ?? "");

  // Single-file state
  const [file, setFile] = useState<File | null>(null);
  // Multi-file state
  const [files, setFiles] = useState<File[]>([]);
  // Controls state
  const [controlValues, setControlValues] = useState<Record<string, string | number>>({});

  const [state, setState] = useState<State>("idle");
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);

  // Initialise control defaults whenever the tool changes
  useEffect(() => {
    const defaults: Record<string, string | number> = {};
    tool?.controls?.forEach((c) => { defaults[c.id] = c.default ?? ""; });
    setControlValues(defaults);
    setFile(null);
    setFiles([]);
    setResults([]);
    setState("idle");
    setError(null);
    setProgress(null);
  }, [tool?.id]);

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

  // Text tools are handled by their own self-contained panel
  if (tool.inputType === "text") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-14 space-y-8">
          <Breadcrumb onBack={() => navigate("/")} />
          <ToolTitle tool={tool} />
          <PrivacyNote />
          <div className="h-px bg-border/60 animate-fade-in-up stagger-2" />
          <TextToolPanel tool={tool} />
        </main>
        <Footer onHome={() => navigate("/")} />
      </div>
    );
  }

  const isMulti = tool.inputType === "multi-file";
  const hasInput = isMulti ? files.length > 0 : !!file;

  const handleConvert = async () => {
    if (!hasInput) return;
    setState("converting");
    setError(null);
    setProgress(null);

    try {
      let out: ConversionResult | ConversionResult[];

      const {
        jpgToPng, pngToJpg, jpgToWebp, webpToPng, webpToJpg, pngToWebp,
        imageToPdf, txtToPdf, pdfToImages,
      } = await import("@/lib/converters");

      const {
        pdfMerge, pdfSplit, pdfRotate, pdfRemovePages, pdfExtractPages,
      } = await import("@/lib/pdf-tools");

      const { imageResize, imageCompress, bulkImageConvert } = await import("@/lib/image-tools");
      const { extractZip, createZip } = await import("@/lib/file-tools");

      const cv = controlValues;

      switch (tool.id) {
        // ── Existing single-file ──────────────────────────────────
        case "jpg-to-png":   out = await jpgToPng(file!); break;
        case "png-to-jpg":   out = await pngToJpg(file!); break;
        case "jpg-to-webp":  out = await jpgToWebp(file!); break;
        case "webp-to-png":  out = await webpToPng(file!); break;
        case "webp-to-jpg":  out = await webpToJpg(file!); break;
        case "png-to-webp":  out = await pngToWebp(file!); break;
        case "image-to-pdf": out = await imageToPdf(file!); break;
        case "txt-to-pdf":   out = await txtToPdf(file!); break;
        case "pdf-to-jpg":
          out = await pdfToImages(file!, "image/jpeg", (p, t) => setProgress({ page: p, total: t }));
          break;
        case "pdf-to-png":
          out = await pdfToImages(file!, "image/png", (p, t) => setProgress({ page: p, total: t }));
          break;

        // ── New PDF (single file) ─────────────────────────────────
        case "pdf-split":
          out = await pdfSplit(file!, String(cv.ranges ?? ""));
          break;
        case "pdf-rotate":
          out = await pdfRotate(file!, Number(cv.degrees ?? 90), String(cv.pages ?? ""));
          break;
        case "pdf-remove-pages":
          out = await pdfRemovePages(file!, String(cv.pages ?? ""));
          break;
        case "pdf-extract-pages":
          out = await pdfExtractPages(file!, String(cv.pages ?? ""));
          break;

        // ── New PDF (multi-file) ──────────────────────────────────
        case "pdf-merge":
          out = await pdfMerge(files);
          break;

        // ── New Image (single file) ───────────────────────────────
        case "image-resize":
          out = await imageResize(file!, Number(cv.width ?? 800), Number(cv.height ?? 600));
          break;
        case "image-compress":
          out = await imageCompress(file!, Number(cv.quality ?? 70));
          break;
        case "extract-zip":
          out = await extractZip(file!);
          break;

        // ── New Image + File (multi-file) ─────────────────────────
        case "bulk-image-convert":
          out = await bulkImageConvert(
            files,
            (cv.format ?? "image/jpeg") as "image/jpeg" | "image/png" | "image/webp"
          );
          break;
        case "create-zip":
          out = await createZip(files);
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
    setFiles([]);
    setResults([]);
    setState("idle");
    setError(null);
    setProgress(null);
  };

  const buttonLabel = isMulti
    ? files.length > 0
      ? `Process ${files.length} file${files.length > 1 ? "s" : ""}`
      : "Process files"
    : `Convert to ${tool.to}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-14 space-y-8">
        <Breadcrumb onBack={() => navigate("/")} />
        <ToolTitle tool={tool} />
        <PrivacyNote />
        <div className="h-px bg-border/60 animate-fade-in-up stagger-2" />

        {state === "done" ? (
          <OutputPreview results={results} onReset={handleReset} />
        ) : (
          <div className="space-y-5 animate-fade-in-up stagger-3">
            {isMulti ? (
              <MultiFileUploader
                accept={tool.accept}
                files={files}
                onFiles={setFiles}
                onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                onClear={() => setFiles([])}
              />
            ) : (
              <FileUploader
                accept={tool.accept ?? "*"}
                onFile={setFile}
                currentFile={file}
                onClear={() => setFile(null)}
              />
            )}

            {/* Tool-specific controls */}
            {tool.controls && tool.controls.length > 0 && (
              <ToolControls
                controls={tool.controls}
                values={controlValues}
                onChange={(id, val) => setControlValues((prev) => ({ ...prev, [id]: val }))}
              />
            )}

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
              disabled={!hasInput || state === "converting"}
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
                  Processing…
                </>
              ) : (
                <>
                  {buttonLabel}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        )}
      </main>
      <Footer onHome={() => navigate("/")} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function Breadcrumb({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <ChevronLeft size={13} />
        All tools
      </button>
    </div>
  );
}

function ToolTitle({ tool }: { tool: ReturnType<typeof getTool> & object }) {
  return (
    <div className="animate-fade-in-up stagger-1 space-y-2">
      <div className="flex items-center gap-2.5 flex-wrap">
        <h1 className="font-serif text-3xl text-foreground">{tool.title}</h1>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
          <span className="px-2 py-1 rounded-md bg-secondary">{tool.from}</span>
          <ArrowRight size={12} />
          <span className="px-2 py-1 rounded-md bg-secondary text-primary">{tool.to}</span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{tool.description}</p>
    </div>
  );
}

function PrivacyNote() {
  return (
    <div className="animate-fade-in-up stagger-2 flex items-center gap-2 text-xs text-muted-foreground/70">
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      Files are processed locally in your browser — nothing is uploaded
    </div>
  );
}

function Footer({ onHome }: { onHome: () => void }) {
  return (
    <footer className="border-t border-border/60 py-5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Powered by{" "}
          <button onClick={onHome} className="hover:text-primary transition-colors">
            fileconv
          </button>
        </p>
      </div>
    </footer>
  );
}
