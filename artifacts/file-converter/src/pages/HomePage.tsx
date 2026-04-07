import { useState, type DragEvent } from "react";
import { useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TOOLS, detectCategory, type ToolCategory, type Tool } from "@/lib/tools";
import { Shield, Zap, Lock, Upload, FileText, Image, Archive, Code } from "lucide-react";

const CATEGORIES: { id: ToolCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "pdf", label: "PDF Tools", icon: <FileText size={14} />, color: "text-red-400" },
  { id: "image", label: "Image Tools", icon: <Image size={14} />, color: "text-blue-400" },
  { id: "file", label: "File Tools", icon: <Archive size={14} />, color: "text-yellow-400" },
  { id: "text", label: "Text & Dev", icon: <Code size={14} />, color: "text-purple-400" },
];

export function HomePage() {
  const [, navigate] = useLocation();
  const [draggingOnZone, setDraggingOnZone] = useState(false);
  const [suggestedTools, setSuggestedTools] = useState<Tool[] | null>(null);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOnZone(true);
  };

  const handleDragLeave = () => setDraggingOnZone(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOnZone(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setDroppedFileName(file.name);
    const category = detectCategory(file.type);
    if (category) {
      setSuggestedTools(TOOLS.filter((t) => t.category === category).slice(0, 4));
    } else {
      setSuggestedTools([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-white/10 bg-[#0e0e0e]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <ThemeToggle className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:border-primary/50 hover:text-primary transition-all duration-300 hover:scale-105" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-5">
          <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
            <Lock size={11} />
            Your files never leave your device
          </div>
          <h1 className="animate-fade-in-up stagger-2 font-serif text-5xl sm:text-6xl text-foreground leading-tight">
            Convert, compress,<br />
            <span className="text-primary italic">transform.</span>
          </h1>
          <p className="animate-fade-in-up stagger-3 text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            30+ browser-based tools for PDF, images, files & text. 100% private — no uploads, no accounts.
          </p>
        </div>

        {/* Smart drop zone */}
        <div className="animate-fade-in-up stagger-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              w-full flex flex-col items-center justify-center gap-3
              px-6 py-10 rounded-2xl border-2 border-dashed
              transition-all duration-300
              ${draggingOnZone
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/40 hover:bg-card/40 cursor-default"}
            `}
          >
            <div className={`w-10 h-10 rounded-xl border border-border bg-secondary flex items-center justify-center transition-colors duration-300 ${draggingOnZone ? "border-primary/60 bg-primary/10" : ""}`}>
              <Upload size={17} className={draggingOnZone ? "text-primary" : "text-muted-foreground"} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Drop any file here</p>
              <p className="text-xs text-muted-foreground mt-0.5">We'll suggest the right tools instantly</p>
            </div>
          </div>

          {/* Suggestion panel */}
          {suggestedTools !== null && (
            <div className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary/5 animate-fade-in">
              {suggestedTools.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  No specific tools for this file type — browse all tools below.
                </p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Suggested tools for <span className="text-foreground font-medium">{droppedFileName}</span>:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => navigate(`/tools/${tool.id}`)}
                        className="
                          flex items-start gap-2.5 p-3 rounded-xl text-left
                          border border-border bg-card
                          hover:border-primary/40 hover:scale-[1.01]
                          transition-all duration-200
                        "
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{tool.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{tool.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { setSuggestedTools(null); setDroppedFileName(null); }}
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="animate-fade-in-up stagger-5 grid grid-cols-3 gap-3">
          {[
            { icon: <Shield size={14} className="text-primary" />, text: "No file uploads" },
            { icon: <Zap size={14} className="text-primary" />, text: "Instant in-browser" },
            { icon: <Lock size={14} className="text-primary" />, text: "Zero data stored" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card text-sm text-muted-foreground"
            >
              {icon}
              <span className="text-xs">{text}</span>
            </div>
          ))}
        </div>

        {/* Tool grid by category */}
        {CATEGORIES.map((cat, ci) => {
          const categoryTools = TOOLS.filter((t) => t.category === cat.id);
          return (
            <div key={cat.id} className={`space-y-4 animate-fade-in-up stagger-${Math.min(ci + 5, 9)}`}>
              <div className="flex items-center gap-2">
                <span className={cat.color}>{cat.icon}</span>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {cat.label}
                </h2>
                <span className="text-xs text-muted-foreground/40">· {categoryTools.length} tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categoryTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => navigate(`/tools/${tool.id}`)}
                    className="
                      group flex items-start justify-between p-4 rounded-xl
                      border border-border bg-card text-left
                      hover:border-primary/40 hover:bg-card
                      transition-all duration-300 hover:scale-[1.01]
                    "
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{tool.title}</span>
                        {tool.inputType !== "text" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono shrink-0">
                            {tool.from} → {tool.to}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="ml-3 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300 mt-0.5 shrink-0">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-[#a3a3a3]">
            Made by{" "}
            <a
              href="https://x.com/alexanderte7a?s=21"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
            >
              Alexander
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
