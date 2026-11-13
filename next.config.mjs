/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three ships ESM; transpile for older iOS Safari (iOS 16+ baseline)
  transpilePackages: ["three"],
};
export default nextConfig;
