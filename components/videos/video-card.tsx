import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { HiOutlinePlay } from "react-icons/hi2";

interface VideoCardProps {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  model: string;
  views: number;
  previewUrl?: string;
}

export function VideoCard({
  id,
  title,
  duration,
  thumbnail,
  model,
  views,
  previewUrl,
}: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && previewUrl) {
      videoRef.current.play().catch(() => {
        // Silently catch play errors
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link href={`/videos/${id}`}>
      <Card
        className="group cursor-pointer h-full relative overflow-hidden py-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-video w-full h-full bg-muted">
          {isHovering && previewUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={previewUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

          {/* Duration badge */}
          <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-xs font-semibold text-white">
            {duration}
          </div>

          {/* Play button on hover */}
          <div className="absolute bottom-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/40 rounded-full p-2">
              <HiOutlinePlay className="size-5 text-white" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h2 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
              {title}
            </h2>
            <p className="text-xs text-gray-200">{model}</p>
            <p className="text-xs text-gray-300">{views} views</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
