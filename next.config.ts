/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    domains: [
      "picsum.photos",
      "img.youtube.com",
      "i.ytimg.com",
      "lh3.googleusercontent.com",
      "via.placeholder.com",
    ],
  },
};

module.exports = nextConfig;