import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  devIndicators: {
    // @ts-ignore - Hiding the dev indicator
    buildActivity: false,
    // @ts-ignore
    appIsrStatus: false,
  },
};

export default nextConfig;
