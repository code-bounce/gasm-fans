"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useHeader } from "@/lib/header-context";
import { EditModelSheet } from "@/components/models/edit-model-sheet";
import { VideoCard } from "@/components/videos/video-card";
import { AddVideoSheet } from "@/components/videos/add-video-sheet";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Model } from "@/lib/types";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { MdAddCircle } from "react-icons/md";

async function fetchModel(id: string): Promise<Model> {
  const response = await fetch(`/api/models/${id}`);
  if (!response.ok) throw new Error("Failed to fetch model");
  return response.json();
}

export default function ModelPage() {
  const params = useParams();
  const { setTitle } = useHeader();
  const id = params.id as string;
  const {
    data: model,
    isLoading: loading,
    error,
  } = useQuery<Model, Error>({
    queryKey: ["model", id],
    queryFn: () => fetchModel(id),
  });

  useEffect(() => {
    if (model) {
      setTitle(model.name);
    }
    return () => {
      setTitle("GASM FANS");
    };
  }, [model, setTitle]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-muted-foreground">Loading model...</p>
      </main>
    );
  }

  if (error || !model) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold mb-4">Model not found</h1>
        <Link
          href="/models"
          className="text-primary hover:underline flex items-center gap-2 mb-6 self-start"
        >
          <HiOutlineArrowLeft className="size-4" />
          Back to models
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <Link
        href="/models"
        className="text-primary hover:underline flex items-center gap-2 mb-6 self-start"
      >
        <HiOutlineArrowLeft className="size-4" />
        Back to models
      </Link>

      {/* Image and Basic Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Image */}
        {model.image && (
          <div className="md:col-span-1">
            <Card className="overflow-hidden p-0 h-fit">
              <div className="relative w-full aspect-3/4 bg-muted">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          </div>
        )}

        {/* Basic Info */}
        <div className={`${model.image ? "md:col-span-3" : "md:col-span-4"}`}>
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-1 wrap-break-word">
                {model.name}
              </h1>
              {model.ethnicity && (
                <p className="text-sm text-muted-foreground">
                  {model.ethnicity}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <EditModelSheet model={model} />
            </div>
          </div>

          {/* Bio */}
          {model.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                About
              </h3>
              <p className="text-xs leading-relaxed">{model.bio}</p>
            </div>
          )}

          {/* Measurements & DOB */}
          <div className="grid grid-cols-2 gap-6">
            {model.measurements && (
              <div>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Measurements
                </h3>
                <p className="text-base font-semibold">{model.measurements}</p>
              </div>
            )}
            {model.dateOfBirth && (
              <div>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Date of Birth
                </h3>
                <p className="text-base font-semibold">
                  {new Date(model.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Videos Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Videos ({model.videos?.length || 0})
          </h2>
          <AddVideoSheet
            defaultModelId={model.id}
            trigger={
              <Button size="sm">
                <MdAddCircle className="size-4 mr-2" />
                Add Video
              </Button>
            }
          />
        </div>
        {model.videos && model.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {model.videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                duration={video.duration || ""}
                thumbnail={video.thumbnail || ""}
                model={video.models?.[0]?.name || model.name}
                views={video.views}
                previewUrl={video.previewUrl ?? undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No videos available</p>
        )}
      </div>
    </main>
  );
}
