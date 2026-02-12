import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdni.pornpics.com",
      },
      {
        protocol: "https",
        hostname: "cdni.pornpics.com",
      },
      {
        protocol: "http",
        hostname: "nsnetworkmembers.newsensations.com",
      },
      {
        protocol: "https",
        hostname: "nsnetworkmembers.newsensations.com",
      },
    ],
  },
};

export default nextConfig;
