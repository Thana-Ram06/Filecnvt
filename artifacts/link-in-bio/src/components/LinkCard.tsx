import { ExternalLink, Globe, Twitter, Github, Linkedin, Mail, Instagram } from "lucide-react";

interface LinkCardProps {
  title: string;
  url: string;
  icon?: string;
  index?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={16} />,
  twitter: <Twitter size={16} />,
  github: <Github size={16} />,
  linkedin: <Linkedin size={16} />,
  mail: <Mail size={16} />,
  instagram: <Instagram size={16} />,
  dribbble: <Globe size={16} />,
};

export function LinkCard({ title, url, icon, index = 0 }: LinkCardProps) {
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  return (
    <a
      href={url}
      target={url.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`
        group flex items-center justify-between w-full px-5 py-4
        bg-card border border-border rounded-xl
        hover:border-primary/40 hover:bg-card
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5
        cursor-pointer
        animate-fade-in-up ${staggerClass}
      `}
    >
      <div className="flex items-center gap-3">
        {icon && iconMap[icon] && (
          <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {iconMap[icon]}
          </span>
        )}
        <span className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </span>
      </div>
      <ExternalLink
        size={14}
        className="text-muted-foreground/40 group-hover:text-primary/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
