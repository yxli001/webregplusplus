import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
