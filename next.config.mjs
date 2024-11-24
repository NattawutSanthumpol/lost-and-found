/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
        hostname: "images.unsplash.com",
        hostname: "qwddhujeesflufoopczk.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb", // กำหนดขนาดบอดี้สูงสุดเป็น 15MB
    },
  },
};

export default nextConfig;
