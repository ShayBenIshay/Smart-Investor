import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  experimental: {
    incrementalCacheHandlerPath: path.resolve(
      __dirname,
      "node_modules/next/dist/server/incremental-cache"
    ),
  },

  distDir: path.join("/var/cache/nextjs", ".next"),
};

export default nextConfig;
