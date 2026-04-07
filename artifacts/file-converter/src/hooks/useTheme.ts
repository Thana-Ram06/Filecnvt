import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("fc-theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.classList.add("light");
    else root.classList.remove("light");
    try { localStorage.setItem("fc-theme", theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  return { theme, toggleTheme };
}
