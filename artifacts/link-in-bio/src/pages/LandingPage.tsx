import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { ArrowRight, Zap, LinkIcon, Palette } from "lucide-react";

export function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-border/60 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/u/demo")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Demo
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
            <Zap size={11} />
            Simple & Free — No Account Needed
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up stagger-2 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-foreground">
            One link.<br />
            <span className="text-primary italic">Everything</span> you are.
          </h1>

          {/* Description */}
          <p className="animate-fade-in-up stagger-3 text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Create a beautiful, minimal profile page with all your links — ready in seconds, no sign-up required.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/u/demo")}
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl
                bg-primary text-primary-foreground font-medium text-sm
                hover:opacity-90 transition-all duration-300 hover:scale-105
                shadow-lg shadow-primary/20
              "
            >
              View Demo Profile
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate("/u/thana")}
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl
                border border-border bg-card text-foreground font-medium text-sm
                hover:border-primary/40 transition-all duration-300 hover:scale-105
              "
            >
              See an Example
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 max-w-3xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <LinkIcon size={18} className="text-primary" />,
              title: "All your links",
              desc: "Portfolio, social media, newsletter — all in one clean page.",
            },
            {
              icon: <Palette size={18} className="text-primary" />,
              title: "Premium design",
              desc: "Dark mode by default. Minimal, premium aesthetic that looks great.",
            },
            {
              icon: <Zap size={18} className="text-primary" />,
              title: "Instant & static",
              desc: "No database, no sign-up, no backend. Just fast, clean pages.",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`
                p-5 rounded-xl border border-border bg-card
                hover:border-primary/30 transition-all duration-300
                animate-fade-in-up stagger-${i + 5}
              `}
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Profile URLs preview */}
        <div className="mt-16 text-center animate-fade-in-up stagger-8">
          <p className="text-xs text-muted-foreground/60 mb-3">Your profile lives at</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["thana", "alex", "demo"].map((slug) => (
              <button
                key={slug}
                onClick={() => navigate(`/u/${slug}`)}
                className="
                  px-3 py-1.5 rounded-lg border border-border/60
                  text-xs text-muted-foreground font-mono
                  hover:border-primary/40 hover:text-primary
                  transition-all duration-300
                "
              >
                /u/{slug}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Logo />
          <p className="text-xs text-muted-foreground">
            Built with care · Fully static
          </p>
        </div>
      </footer>
    </div>
  );
}
