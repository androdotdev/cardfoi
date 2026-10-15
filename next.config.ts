import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Robots-Tag", value: "noai, noimageai" },
          { key: "Link", value: '</.well-known/resources>; rel="api-catalog mcp-server agent-skills"' },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Signal", value: "ai-train=no, search=yes, ai-input=no" },
        ],
      },
    ];
  },
};

export default nextConfig;
