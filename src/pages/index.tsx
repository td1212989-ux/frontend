import { useQuery } from "@tanstack/react-query";
import {
  Video as VideoIcon,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { VideosApi, type Video } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: VideosApi.list,
    retry: 0,
  });

  const videos: Video[] = data ?? [];
  const total = videos.length;
  const uploaded = videos.filter((v) => v.status === "uploaded").length;
  const pending = videos.filter(
    (v) => v.status === "pending" || v.status === "scheduled"
  ).length;
  const failed = videos.filter((v) => v.status === "failed").length;

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>

        <p className="text-muted-foreground mt-1">
          Your AI uploader is running smoothly. Here's a snapshot.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Videos" value={total} icon={VideoIcon} accent />

        <StatCard
          label="Uploaded"
          value={uploaded}
          icon={CheckCircle2}
          trend="Live on channels"
        />

        <StatCard
          label="Pending"
          value={pending}
          icon={Clock}
          trend="Awaiting schedule"
        />

        <StatCard
          label="Failed"
          value={failed}
          icon={XCircle}
          trend="Retry available"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent uploads</h2>

            <TrendingUp className="h-4 w-4 text-primary" />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-border">
              {videos.slice(0, 6).map((v) => (
                <li
                  key={v.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{v.title}</div>

                    <div className="text-xs text-muted-foreground">
                      {v.uploadDate ?? "—"}
                    </div>
                  </div>

                  <StatusBadge status={v.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-6">
          <h2 className="text-lg font-semibold">Upload health</h2>

          <p className="text-sm text-muted-foreground mt-1">
            Success ratio across all attempts.
          </p>

          <div className="mt-6">
            <div className="text-5xl font-semibold">
              {total === 0
                ? "—"
                : `${Math.round((uploaded / total) * 100)}%`}
            </div>

            <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    total === 0 ? 0 : (uploaded / total) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatusBadge({ status }: { status: Video["status"] }) {
  const map: Record<Video["status"], string> = {
    uploaded: "bg-primary/15 text-primary",
    pending: "bg-secondary text-foreground",
    scheduled: "bg-secondary text-foreground",
    failed: "bg-destructive/15 text-destructive",
  };

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full capitalize ${map[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      No videos yet. Head to{" "}
      <span className="text-primary">Bulk Upload</span> to get started.
    </div>
  );
}