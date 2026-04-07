import { useLocation } from "wouter";

export function Logo() {
  const [, navigate] = useLocation();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center group"
    >
      <img
        src="/nexify-logo.png"
        alt="Nexify"
        className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
      />
    </button>
  );
}
