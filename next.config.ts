import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    '@libsql/client',
    'libsql',
    '@prisma/adapter-libsql',
  ],
};
export default nextConfig;