import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'uploadthing.com',
      },
      {
        hostname: 'utfs.io',
      },
      {
        hostname: '2c2xgszlh6.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
