/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  },
  compiler: {
    removeConsole: {
      exclude: ["error"], // 保留 console.error
    },
  },
};

export default nextConfig;
