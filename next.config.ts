import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const nextConfig: NextConfig = {
  env: {
    GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  },
  // Explicitly configure to use webpack

  // Ensure we're using the webpack configuration
  webpack: (config, { isServer }) => {
    // Any custom webpack configurations if needed
    return config;
  },
};

export default nextConfig;
