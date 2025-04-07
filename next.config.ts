import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const nextConfig: NextConfig = {
  env: {
    GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  },
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here if needed
    return config;
  },
  // Disable ESLint checking during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this to disable TypeScript checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
