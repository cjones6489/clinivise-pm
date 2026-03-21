import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.clinivise.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' https://img.clerk.com data: blob:",
            "font-src 'self'",
            "connect-src 'self' https://api.clerk.com https://clerk.clinivise.com https://*.vercel-blob.com",
            "frame-src 'self' https://clerk.clinivise.com",
          ].join("; "),
        },
      ],
    },
  ],

  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
