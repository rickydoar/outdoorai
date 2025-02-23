/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rei.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'adexusa.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
