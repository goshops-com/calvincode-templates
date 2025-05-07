/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // use swc for dev, only use babel for build prod online demo
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
