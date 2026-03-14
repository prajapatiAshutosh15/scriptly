/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  transpilePackages: ["antd", "@ant-design/icons", "@ant-design/nextjs-registry"],
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
