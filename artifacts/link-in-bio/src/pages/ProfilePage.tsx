import { useParams, useLocation } from "wouter";
import { LinkCard } from "@/components/LinkCard";
import { CopyButton } from "@/components/CopyButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import profilesData from "@/data/profiles.json";

interface Link {
  title: string;
  url: string;
  icon?: string;
}

interface Profile {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  links: Link[];
}

const profiles: Profile[] = profilesData as Profile[];

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [, navigate] = useLocation();

  const profile = profiles.find((p) => p.username === username);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 w-full border-b border-border/60 backdrop-blur-sm bg-background/80">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <Logo />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="max-w-sm mx-auto space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl border border-border/60 bg-card flex items-center justify-center mx-auto">
              <span className="text-3xl">?</span>
            </div>
            <h1 className="font-serif text-3xl text-foreground">User not found</h1>
            <p className="text-muted-foreground text-sm">
              No profile found for <span className="font-mono text-foreground">@{username}</span>. Double-check the username.
            </p>
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-border/60 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* Profile */}
      <main className="flex-1 flex flex-col items-center px-6 py-14">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Avatar + Info */}
          <div className="text-center space-y-4 animate-fade-in-up stagger-1">
            <div className="mx-auto w-20 h-20 rounded-2xl border border-border bg-card flex items-center justify-center">
              <span className="font-serif text-2xl text-foreground">{profile.avatar}</span>
            </div>
            <div className="space-y-1.5">
              <h1 className="font-serif text-2xl text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground text-sm">{profile.bio}</p>
            </div>
            <div className="flex items-center justify-center">
              <CopyButton username={profile.username} />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border/60 animate-fade-in-up stagger-2" />

          {/* Links */}
          <div className="space-y-2.5">
            {profile.links.map((link, index) => (
              <LinkCard
                key={link.url}
                title={link.title}
                url={link.url}
                icon={link.icon}
                index={index}
              />
            ))}
          </div>

          {/* Username */}
          <p className="text-center text-xs text-muted-foreground/50 font-mono animate-fade-in-up stagger-8">
            @{profile.username}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-5 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            Powered by{" "}
            <button
              onClick={() => navigate("/")}
              className="hover:text-primary transition-colors duration-200"
            >
              linkly
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}
