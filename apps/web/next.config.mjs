/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@carbon-ledger/types'],
  output: 'standalone',
};

export default nextConfig;

