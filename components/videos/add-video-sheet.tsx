"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdAddCircle } from "react-icons/md";
import type { Model } from "@/lib/types";

interface AddVideoSheetProps {
  defaultModelId?: string;
  trigger?: React.ReactNode;
}

export function AddVideoSheet({ defaultModelId, trigger }: AddVideoSheetProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(
    defaultModelId ? [defaultModelId] : [],
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    previewUrl: "",
    thumbnail: "",
    duration: "",
    views: "",
  });

  const { data: modelsResponse } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const res = await fetch("/api/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      return res.json() as Promise<{ data: Model[]; total: number }>;
    },
  });

  const models = modelsResponse?.data ?? [];

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          url: formData.url,
          previewUrl: formData.previewUrl || null,
          thumbnail: formData.thumbnail || null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          views: formData.views ? parseInt(formData.views) : 0,
          modelIds: selectedModelIds,
        }),
      });

      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          url: "",
          previewUrl: "",
          thumbnail: "",
          duration: "",
          views: "",
        });
        setSelectedModelIds([]);
        setOpen(false);
        // Invalidate videos query cache
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      } else {
        const error = await response.json();
        alert(`Failed to create video: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating video:", error);
      alert("Error creating video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <MdAddCircle className="size-4 mr-2" />
            Add Video
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-h-screen overflow-y-auto px-5">
        <SheetHeader className="px-0">
          <SheetTitle>Add New Video</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new video to the system.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Video title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Video description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">Video URL *</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/video.mp4"
              value={formData.url}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Preview URL */}
          <div className="space-y-2">
            <Label htmlFor="previewUrl">Preview URL</Label>
            <Input
              id="previewUrl"
              name="previewUrl"
              type="url"
              placeholder="https://example.com/preview.mp4"
              value={formData.previewUrl}
              onChange={handleInputChange}
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              type="url"
              placeholder="https://example.com/thumbnail.jpg"
              value={formData.thumbnail}
              onChange={handleInputChange}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              placeholder="3600"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>

          {/* Views */}
          <div className="space-y-2">
            <Label htmlFor="views">Views</Label>
            <Input
              id="views"
              name="views"
              type="number"
              placeholder="0"
              value={formData.views}
              onChange={handleInputChange}
            />
          </div>

          {/* Models Selection */}
          <div className="space-y-2">
            <Label>Associated Models</Label>
            <Input
              type="text"
              placeholder="Search models..."
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="mb-2"
            />
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
              {filteredModels.length > 0 ? (
                filteredModels.map((model) => (
                  <label key={model.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedModelIds.includes(model.id)}
                      onChange={() => handleModelToggle(model.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{model.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No models found</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.url}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Video"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
