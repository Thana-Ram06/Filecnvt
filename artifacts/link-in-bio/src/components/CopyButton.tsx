import { useState } from "react";
import { Link, Check } from "lucide-react";

interface CopyButtonProps {
  username: string;
}

export function CopyButton({ username }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/u/${username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="
        flex items-center gap-2 px-4 py-2
        rounded-xl border border-border
        bg-card text-muted-foreground text-sm
        hover:border-primary/40 hover:text-primary
        transition-all duration-300
        hover:scale-105
      "
    >
      {copied ? (
        <>
          <Check size={14} className="text-primary" />
          <span className="text-primary">Copied!</span>
        </>
      ) : (
        <>
          <Link size={14} />
          <span>Copy link</span>
        </>
      )}
    </button>
  );
}
