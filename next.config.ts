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
  // Add this eslint configuration to ignore errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
