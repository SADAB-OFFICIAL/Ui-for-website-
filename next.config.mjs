/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "movies4u.nexus" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "catimages.org" }, // Zip file mein ye domain bhi tha
      { protocol: "https", hostname: "**" }, // Allow all fallback
    ],
  },
  // Cheerio error fix
  serverExternalPackages: ["cheerio"],
};

export default nextConfig;
