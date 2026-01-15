import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dreamhouse05.com',
      },
      {
        protocol: 'https',
        hostname: 'optim.tildacdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: '**.tildacdn.com',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Разрешаем неоптимизированные изображения для внешних источников
    unoptimized: false,
  },
  devIndicators: false,
};

export default nextConfig;
