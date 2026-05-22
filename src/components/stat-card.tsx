import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: boolean;
}

export function StatCard({ label, value, icon: Icon, trend, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 transition-colors hover:border-primary/40",
        accent && "bg-gradient-to-br from-primary/15 via-card to-card border-primary/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className={cn(
            "h-9 w-9 rounded-xl grid place-items-center",
            accent ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      {trend && <div className="text-xs text-muted-foreground">{trend}</div>}
    </div>
  );
}
