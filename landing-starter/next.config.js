/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // use swc for dev, only use babel for build prod online demo
    forceSwcTransforms: true,
  },
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
