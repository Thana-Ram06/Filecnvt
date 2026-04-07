import { useLocation } from "wouter";

export function Logo() {
  const [, navigate] = useLocation();
  return (
    <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
      <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground text-xs font-semibold">F</span>
      </div>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
        fileconv
      </span>
    </button>
  );
}
