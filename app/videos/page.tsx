"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHeader } from "@/lib/header-context";
import { VideoCard } from "@/components/videos/video-card";
import { AddVideoSheet } from "@/components/videos/add-video-sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdSearch } from "react-icons/md";
import type { Video } from "@/lib/types";

export default function VideosPage() {
  const { setTitle } = useHeader();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const { data: videosResponse } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json() as Promise<{ data: Video[]; total: number }>;
    },
  });

  const videos = videosResponse?.data ?? [];
  const isLoading = !videosResponse;
  useEffect(() => {
    setTitle("Videos");
    return () => {
      setTitle("GASM FANS");
    };
  }, [setTitle]);

  let filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (sort === "recent") {
    filteredVideos.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  } else if (sort === "oldest") {
    filteredVideos.sort(
      (a, b) =>
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
    );
  } else if (sort === "most-views") {
    filteredVideos.sort((a, b) => b.views - a.views);
  } else if (sort === "title-az") {
    filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <main className="p-6">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-views">Most Views</SelectItem>
                <SelectItem value="title-az">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AddVideoSheet />

        <div className="text-sm text-muted-foreground">
          Showing {filteredVideos.length} of {videos.length} videos
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              duration={video.duration || ""}
              thumbnail={video.thumbnail || ""}
              model={video.models?.[0]?.name || "Unknown"}
              views={video.views}
              previewUrl={video.previewUrl ?? undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No videos found</p>
          </div>
        )}
      </div>
    </main>
  );
}
