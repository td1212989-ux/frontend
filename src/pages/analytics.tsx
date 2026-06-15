import { useQuery } from "@tanstack/react-query";

import {
  UploadCloud,
  Eye,
  TrendingUp,
  Clock,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";

import { StatCard } from "@/components/stat-card";

import { VideosApi } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";

// ======================
// HELPERS
// ======================

function formatNumber(
  n: number
) {
  if (n >= 1_000_000)
    return `${(
      n / 1_000_000
    ).toFixed(1)}M`;

  if (n >= 1_000)
    return `${(
      n / 1_000
    ).toFixed(1)}K`;

  return String(n);
}

function formatHours(
  minutes: number
) {
  const h = Math.floor(
    minutes / 60
  );

  return `${h.toLocaleString()}h`;
}

// ======================
// PAGE
// ======================

export default function AnalyticsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "analytics",
    ],

    queryFn:
      VideosApi.analytics,

    retry: 0,
  });

  return (
    <DashboardShell>
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Analytics
        </h1>

        <p className="text-muted-foreground mt-1">
          Real-time
          performance
          from{" "}
          <span className="text-foreground">
            /analytics
          </span>
        </p>
      </div>

      {/* LOADING */}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ...Array(4),
          ].map(
            (_, i) => (
              <Skeleton
                key={
                  i
                }
                className="h-32 rounded-2xl"
              />
            )
          )}
        </div>
      ) : isError ||
        !data ? (
        // ERROR

        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Couldn't fetch
          analytics
          from{" "}
          <span className="text-foreground">
            http://localhost:5000/analytics
          </span>
          .
        </div>
      ) : (
        <>
          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Uploads"
              value={formatNumber(
                data.totalUploads
              )}
              icon={
                UploadCloud
              }
              accent
            />

            <StatCard
              label="Views"
              value={formatNumber(
                data.views
              )}
              icon={Eye}
            />

            <StatCard
              label="Success Rate"
              value={`${data.successRate}%`}
              icon={
                TrendingUp
              }
            />

            <StatCard
              label="Watch Time"
              value={formatHours(
                data.watchTime
              )}
              icon={
                Clock
              }
            />
          </div>

          {/* SUCCESS RATE */}

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Success
              Rate
            </h2>

            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60"
                style={{
                  width: `${data.successRate}%`,
                }}
              />
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {
                data.successRate
              }
              % of uploads
              completed
              without retry
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}