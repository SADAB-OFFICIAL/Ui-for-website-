/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Yeh line undici error ko rokne mein madad karti hai
  serverExternalPackages: ["cheerio"], 
};

export default nextConfig;
