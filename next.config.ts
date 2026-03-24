import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pngarts.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // আপনার এরর ফিক্স করার জন্য এটি যোগ করা হলো
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;