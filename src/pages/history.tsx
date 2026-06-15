import { useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { Trash2 } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";

import { VideosApi } from "@/lib/api";

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const qc =
    useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos"],

    queryFn:
      VideosApi.list,
  });

  const handleDelete =
    async (
      id: string
    ) => {
      try {
        await VideosApi.remove(
          id
        );

        toast.success(
          "Video Deleted"
        );

        qc.invalidateQueries(
          {
            queryKey: [
              "videos",
            ],
          }
        );
      } catch (
        error
      ) {
        console.log(
          error
        );

        toast.error(
          "Delete Failed"
        );
      }
    };

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Upload History
        </h1>

        <p className="text-muted-foreground mt-2">
          All uploaded
          videos
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[
              ...Array(5),
            ].map(
              (_, i) => (
                <Skeleton
                  key={
                    i
                  }
                  className="h-16 w-full rounded-xl"
                />
              )
            )}
          </div>
        ) : isError ? (
          <div className="p-10 text-center">
            Failed To
            Load Videos
          </div>
        ) : data?.length ===
          0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No Videos
            Uploaded
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/40">
                <tr className="text-left text-sm">
                  <th className="px-5 py-4">
                    Video
                  </th>

                  <th className="px-5 py-4">
                    Title
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map(
                  (
                    video: any
                  ) => (
                    <tr
                      key={
                        video._id
                      }
                      className="border-t border-border"
                    >
                      <td className="px-5 py-4">
                        <video
                          src={
                            video.videoUrl
                          }
                          className="w-40 h-24 rounded-lg object-cover"
                          controls
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {
                            video.titleHindi
                          }
                        </div>

                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {
                            video.descriptionEnglish
                          }
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {new Date(
                          video.createdAt
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(
                              video._id
                            )
                          }
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}