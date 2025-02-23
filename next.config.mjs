/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rei.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
