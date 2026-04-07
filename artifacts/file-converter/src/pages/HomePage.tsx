import { useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TOOLS, type ToolCategory } from "@/lib/tools";
import { Shield, Zap, Lock } from "lucide-react";

const CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: "pdf", label: "PDF Tools" },
  { id: "image", label: "Image Tools" },
];

export function HomePage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-border/60 backdrop-blur-sm bg-background/80">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
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
            Convert files<br />
            <span className="text-primary italic">instantly.</span>
          </h1>
          <p className="animate-fade-in-up stagger-3 text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            100% private, browser-based file conversion. No uploads, no accounts, no tracking.
          </p>
        </div>

        {/* Trust badges */}
        <div className="animate-fade-in-up stagger-4 grid grid-cols-3 gap-3">
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
        {CATEGORIES.map((cat, ci) => (
          <div key={cat.id} className={`space-y-4 animate-fade-in-up stagger-${ci + 5}`}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOOLS.filter((t) => t.category === cat.id).map((tool) => (
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{tool.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
                        {tool.from} → {tool.to}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="ml-3 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Logo />
          <p className="text-xs text-muted-foreground/60">100% client-side · Zero uploads</p>
        </div>
      </footer>
    </div>
  );
}
