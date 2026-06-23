import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xjceimihaufbhnpysbjo.supabase.co",
      },
    ],
  },
};

export default nextConfig;
