import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export const AppHeader = ({ showBack, title }: { showBack?: boolean; title?: string }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
    <Link to="/menu" className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        <span className="font-bold text-lg text-foreground tracking-tight">🌿 FreshCanteen</span>
      </span>
    </Link>
    {title && <h1 className="font-semibold text-foreground">{title}</h1>}
    <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
      <Bell className="w-5 h-5 text-foreground" />
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
    </button>
  </header>
);
