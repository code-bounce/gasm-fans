"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useHeader } from "@/lib/header-context";
import { VideoPlayer } from "@/components/video-plyr";
import { EditVideoSheet } from "@/components/videos/edit-video-sheet";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import type { Video } from "@/lib/types";

export default function VideoPage() {
  const params = useParams();
  const { setTitle } = useHeader();

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", params],
    queryFn: async () => {
      const { id } = await params;
      const res = await fetch(`/api/videos/${id}`);
      if (!res.ok) throw new Error("Failed to fetch video");
      return res.json() as Promise<Video>;
    },
  });

  useEffect(() => {
    if (video) {
      setTitle(video.title);
    }
    return () => {
      setTitle("GASM FANS");
    };
  }, [video, setTitle]);

  if (isLoading) {
    return (
      <main className="p-6">
        <p className="text-muted-foreground">Loading video...</p>
      </main>
    );
  }

  if (!video) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
        <Link
          href="/videos"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <HiOutlineArrowLeft className="size-4" />
          Back to videos
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 flex flex-col items-center max-w-4xl mx-auto min-h-screen">
      <Link
        href="/videos"
        className="text-primary hover:underline flex items-center gap-2 mb-6 self-start"
      >
        <HiOutlineArrowLeft className="size-4" />
        Back to videos
      </Link>

      <div className=" w-full">
        <div className="mb-6">
          <VideoPlayer src={video.url} title={video.title} autoplay={true} />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{video.title}</h1>
                <p className="text-muted-foreground">
                  Models:{" "}
                  {video.models?.map((m) => m.name).join(", ") || "Unknown"}
                </p>
              </div>
              {video && <EditVideoSheet video={video} />}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold">{video.duration || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Views</p>
              <p className="font-semibold">{video.views.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Uploaded</p>
              <p className="font-semibold">
                {new Date(video.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold text-green-500">Available</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">
              {video.description || "No description available"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
