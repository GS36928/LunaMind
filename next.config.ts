import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // Cloudinary domain
  },

  // დაამატე ეს ნაწილი Flitt-ის callback-ისთვის
  async headers() {
    return [
      {
        source: "/api/flitt/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST, GET, OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, x-forwarded-host, origin",
          },
        ],
      },
      {
        source: "/api/book-lesson",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },

  // დაამატე ეს experimental configuration
  experimental: {
    serverActions: {
      allowedOrigins: ["evectus.ge", "pay.flitt.com", "localhost:3000"],
    },
  },
};

export default withNextVideo(nextConfig);
