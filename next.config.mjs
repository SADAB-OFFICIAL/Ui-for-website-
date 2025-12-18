/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "movies4u.nexus" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**" }, // Allow all for scraper flexibility
    ],
  },
};

export default nextConfig;
