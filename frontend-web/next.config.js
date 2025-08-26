// File path: arioncomply-v1/frontend-web/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Remove experimental.appDir - not needed in Next.js 14
  
  // Only include rewrites if you have Supabase URL configured
  ...(process.env.NEXT_PUBLIC_SUPABASE_URL && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/:path*`,
        },
      ];
    },
  }),
};

module.exports = nextConfig;