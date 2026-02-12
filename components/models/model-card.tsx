"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FaStar, FaArrowRight, FaImage } from "react-icons/fa";
import type { Model } from "@/lib/types";

interface ModelCardProps {
  id: string;
  name: string;
  videos: number;
  image: string | null;
  rating?: number;
  hideImage?: boolean;
}

export function ModelCard({
  id,
  name,
  videos,
  image,
  rating = 5,
  hideImage = false,
}: ModelCardProps) {
  return (
    <Link href={`/models/${id}`}>
      <Card className="group cursor-pointer h-full relative overflow-hidden py-0">
        <div className="relative aspect-3/4 w-full h-full bg-muted">
          {!hideImage && image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {hideImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <FaImage className="size-12 text-muted-foreground/40" />
            </div>
          )}
          {!hideImage && (
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
          )}

          {/* Rating in top right */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
            <FaStar className="size-3 text-yellow-400" />
            <span className="text-xs font-semibold text-white">
              {rating.toFixed(1)}
            </span>
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 p-4 ${hideImage ? "bg-muted" : ""}`}
          >
            <h2
              className={`text-base font-semibold ${hideImage ? "text-foreground" : "text-white"} transition-colors`}
            >
              {name}
            </h2>
            <p
              className={`text-xs ${hideImage ? "text-muted-foreground" : "text-gray-200"}`}
            >
              {videos} videos
            </p>
          </div>

          {/* Arrow on bottom right - animated on hover */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <FaArrowRight
              className={`size-5 ${hideImage ? "text-foreground" : "text-white"}`}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
