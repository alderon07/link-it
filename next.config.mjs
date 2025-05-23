/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/200/**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            port: '',
            pathname: '/**'
          }
        ],
      }
};

export default nextConfig;
