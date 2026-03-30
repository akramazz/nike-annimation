/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clothes.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
