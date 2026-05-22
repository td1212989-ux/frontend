import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UploadCloud,
  History,
  BarChart3,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Bulk Upload", icon: UploadCloud },
  { to: "/history", label: "Upload History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border p-5 flex flex-col gap-6 transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold leading-tight">AutoCast</div>
              <div className="text-xs text-muted-foreground">AI Video Uploader</div>
            </div>
          </Link>
          <button
            className="md:hidden text-muted-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl bg-sidebar-accent p-4 text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Pro tip</div>
          AI titles boost click-through by up to 38%. Review before scheduling.
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:pl-64 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur px-5 md:px-8 h-16">
          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-muted-foreground hidden md:block">
            Connected to <span className="text-foreground">localhost:5000</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px] shadow-primary/60" />
            <span className="text-sm">Live</span>
          </div>
        </header>
        <main className="p-5 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
