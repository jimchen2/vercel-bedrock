import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  output: 'export', // Add this line for Tauri static export
  images: {
    unoptimized: true, // Add this line if you're using Next.js Image component
  },
});

export default nextConfig;
