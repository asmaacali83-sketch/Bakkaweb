import type { NextConfig } from "next";

const backendApiOrigin = (
  process.env.BACKEND_API_ORIGIN || "http://localhost:5000/api"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendApiOrigin}/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
