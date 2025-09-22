import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const nav = [
    { to: "/", label: "Home" },
    { to: "/decks", label: "Decks" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">⚡️</span>
          <span className="text-lg">FlashForge</span>
        </Link>
        <nav className="hidden gap-1 sm:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Button asChild className="sm:hidden" variant="outline"><Link to="/decks">Decks</Link></Button>
      </div>
    </header>
  );
}
