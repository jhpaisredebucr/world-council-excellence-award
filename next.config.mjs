/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.254.104'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/aida-public/**',
      },
    ],
  },
};



export default nextConfig;
