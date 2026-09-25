import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://example.com/**'),
      new URL('https://rs-next-app-2-s3-images.s3.eu-west-2.amazonaws.com/**'),
    ],
  },
};

export default nextConfig;
