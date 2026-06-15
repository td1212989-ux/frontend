import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import {
  UploadCloud,
  Trash2,
  Pencil,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { VideosApi } from "@/lib/api";

// ======================
// TYPES
// ======================

interface QueueItem {
  id: string;

  file: File;

  previewUrl: string;

  title: string;

  aiTitle: string;

  editing: boolean;

  status:
    | "queued"
    | "uploading"
    | "done"
    | "failed";
}

// ======================
// AI TITLE
// ======================

function generateAiTitle(
  name: string
) {
  const base =
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ");

  const hooks = [
    "🔥 वायरल वीडियो",
    "😱 आज का धमाका",
    "🚀 इंटरनेट पर ट्रेंडिंग",
    "🔥 देखो क्या हुआ",
    "😳 ये देखकर चौंक जाओगे",
  ];

  const hook =
    hooks[
      Math.floor(
        Math.random() *
          hooks.length
      )
    ];

  return `${hook} — ${base}`;
}

// ======================
// PAGE
// ======================

export default function BulkUploadPage() {
  const [queue, setQueue] =
    useState<QueueItem[]>([]);

  const [uploading, setUploading] =
    useState(false);

  // ======================
  // DROPZONE
  // ======================

  const onDrop =
    useCallback(
      (accepted: File[]) => {
        if (
          accepted.length === 0
        )
          return;

        if (
          accepted.length > 100
        ) {
          toast.error(
            "Maximum 100 videos allowed"
          );

          return;
        }

        const items =
          accepted.map<QueueItem>(
            (file) => ({
              id: `${file.name}-${Math.random()}`,

              file,

              previewUrl:
                URL.createObjectURL(
                  file
                ),

              title:
                file.name.replace(
                  /\.[^.]+$/,
                  ""
                ),

              aiTitle:
                generateAiTitle(
                  file.name
                ),

              editing: false,

              status:
                "queued",
            })
          );

        setQueue((q) => [
          ...q,
          ...items,
        ]);

        toast.success(
          `${accepted.length} videos added`
        );
      },
      []
    );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,

    accept: {
      "video/*": [],
    },

    maxFiles: 100,
  });

  // ======================
  // UPDATE ITEM
  // ======================

  const update = (
    id: string,
    patch: Partial<QueueItem>
  ) => {
    setQueue((q) =>
      q.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
  };

  // ======================
  // REMOVE
  // ======================

  const remove = (
    id: string
  ) => {
    setQueue((q) => {
      const item = q.find(
        (i) => i.id === id
      );

      if (item) {
        URL.revokeObjectURL(
          item.previewUrl
        );
      }

      return q.filter(
        (i) => i.id !== id
      );
    });
  };

  // ======================
  // FAST PARALLEL UPLOAD
  // ======================

  const handleUploadAll =
    async () => {
      if (
        queue.length === 0
      )
        return;

      setUploading(true);

      let ok = 0;

      let fail = 0;

      await Promise.all(
        queue.map(
          async (item) => {
            if (
              item.status ===
              "done"
            )
              return;

            update(item.id, {
              status:
                "uploading",
            });

            try {
              await VideosApi.upload(
                item.file,
                item.title
              );

              update(item.id, {
                status: "done",
              });

              ok++;
            } catch (error) {
              console.log(
                error
              );

              update(item.id, {
                status:
                  "failed",
              });

              fail++;
            }
          }
        )
      );

      setUploading(false);

      if (ok) {
        toast.success(
          `${ok} uploaded successfully`
        );
      }

      if (fail) {
        toast.error(
          `${fail} uploads failed`
        );
      }
    };

  // ======================
  // UI
  // ======================

  return (
    <DashboardShell>
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Bulk Upload
          </h1>

          <p className="text-muted-foreground mt-1">
            Upload videos directly
            to Cloudinary +
            YouTube 🚀
          </p>
        </div>

        <Button
          onClick={
            handleUploadAll
          }
          disabled={
            queue.length ===
              0 || uploading
          }
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4 mr-2" />
          )}

          Upload

          {queue.length > 0 &&
            ` (${queue.length})`}
        </Button>
      </div>

      {/* DROPZONE */}

      <div
        {...getRootProps()}
        className={`
          rounded-2xl
          border-2
          border-dashed
          p-10
          text-center
          cursor-pointer
          transition-colors

          ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:border-primary/50"
          }
        `}
      >
        <input
          {...getInputProps()}
        />

        <UploadCloud className="h-10 w-10 mx-auto text-primary" />

        <div className="mt-3 font-medium">
          {isDragActive
            ? "Drop videos here"
            : "Drag & drop videos or click to browse"}
        </div>

        <div className="text-sm text-muted-foreground mt-1">
          MP4, MOV, WEBM —
          Max 100 videos
        </div>
      </div>

      {/* VIDEO GRID */}

      {queue.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {queue.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* VIDEO */}

              <div className="relative aspect-video bg-black">
                <video
                  src={
                    item.previewUrl
                  }
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />

                {/* STATUS */}

                <span
                  className={`
                    absolute
                    top-2
                    right-2
                    text-xs
                    px-2
                    py-1
                    rounded-full
                    flex
                    items-center
                    gap-1

                    ${
                      item.status ===
                      "done"
                        ? "bg-green-500 text-white"
                        : item.status ===
                            "failed"
                          ? "bg-red-500 text-white"
                          : item.status ===
                              "uploading"
                            ? "bg-yellow-500 text-black"
                            : "bg-secondary text-foreground"
                    }
                  `}
                >
                  {item.status ===
                    "done" && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}

                  {item.status ===
                    "failed" && (
                    <XCircle className="h-3 w-3" />
                  )}

                  {item.status ===
                    "uploading" && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}

                  {item.status}
                </span>
              </div>

              {/* BODY */}

              <div className="p-4 space-y-3">
                {item.editing ? (
                  <Input
                    value={
                      item.title
                    }
                    onChange={(
                      e
                    ) =>
                      update(
                        item.id,
                        {
                          title:
                            e.target
                              .value,
                        }
                      )
                    }
                    onBlur={() =>
                      update(
                        item.id,
                        {
                          editing:
                            false,
                        }
                      )
                    }
                    autoFocus
                    className="bg-secondary border-border"
                  />
                ) : (
                  <div className="font-medium truncate">
                    {item.title}
                  </div>
                )}

                {/* AI TITLE */}

                <div className="rounded-lg bg-secondary/60 border border-border p-3">
                  <div className="flex items-center gap-1.5 text-xs text-primary mb-1">
                    <Sparkles className="h-3 w-3" />

                    AI Title
                  </div>

                  <div className="text-sm">
                    {
                      item.aiTitle
                    }
                  </div>
                </div>

                {/* BUTTONS */}

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      update(
                        item.id,
                        {
                          editing:
                            !item.editing,
                        }
                      )
                    }
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />

                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      remove(
                        item.id
                      )
                    }
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}