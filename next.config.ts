import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    NEXTAUTH_SECRET : process.env.NEXTAUTH_SECRET,
    gmail : process.env.gmail,
    password : process.env.password,
    NEXT_PUBLIC_GEMINI_API_KEY : process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NEXT_PUBLIC_GOOGLE_API_KEY : process.env.NEXT_PUBLIC_GOODLE_API_KEY,
    DATABASE_URL : process.env.DATABASE_URL
  },
};

export default nextConfig;
