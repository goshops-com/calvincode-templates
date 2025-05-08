/** @type {import('next').NextConfig} */
const nextConfig = {
  // SWC is now default in Next.js 15, so we can remove forceSwcTransforms
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *'
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ],
      },
    ]
  }
};

module.exports = nextConfig;
