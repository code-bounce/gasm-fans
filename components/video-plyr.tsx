"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  type?: "video/mp4" | "video/webm" | "video/ogg";
  autoplay?: boolean;
}

export function VideoPlayer({
  src,
  title = "Video Player",
  poster,
  type = "video/mp4",
  autoplay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Plyr
    playerRef.current = new Plyr(videoRef.current, {
      autoplay,
      muted: true,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["quality", "speed", "loop"],
      quality: {
        default: 720,
        options: [360, 720, 1080],
      },
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      },
      keyboard: { focused: true, global: true },
      tooltips: {
        controls: true,
        seek: true,
      },
      ratio: "16:9",
    });

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src, autoplay]);

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        playsInline
        poster={poster}
        title={title}
      >
        <source src={src} type={type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
