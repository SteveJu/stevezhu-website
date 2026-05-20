import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
];

if (process.env.R2_PUBLIC_URL) {
  try {
    const r2PublicUrl = new URL(process.env.R2_PUBLIC_URL);
    remotePatterns.push({
      protocol: r2PublicUrl.protocol.replace(":", "") as "http" | "https",
      hostname: r2PublicUrl.hostname,
    });
  } catch {
    // Keep local development resilient if the optional R2 URL is not a full URL.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
