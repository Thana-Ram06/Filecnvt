import { useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function NotFoundPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 w-full border-b border-border/60 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-sm mx-auto space-y-6 animate-fade-in-up">
          <div className="font-serif text-8xl text-border">404</div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-foreground">Page not found</h1>
            <p className="text-muted-foreground text-sm">
              This page doesn&apos;t exist or has been moved.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              rounded-xl bg-primary text-primary-foreground text-sm font-medium
              hover:opacity-90 transition-all duration-300 hover:scale-105
            "
          >
            Back to home
          </button>
        </div>
      </main>
    </div>
  );
}
