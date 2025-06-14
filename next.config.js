const { join } = require("path");
/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  output: "export", // "standalone" for Docker
  env: {
    SERVER: process.env.SERVER,
    API_SERVER: process.env.SERVER + "/api"
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    dangerouslyAllowSVG: true,
    deviceSizes: [50, 320, 576, 768, 992, 1200, 1400], // breakpoints
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000"
      },
      {
        protocol: "https",
        hostname: "*.istarck.ru",
        port: ""
      }
    ]
  },
  // turbopack: {
  //     rules: {
  //         "*.svg": {
  //             loaders: ["@svgr/webpack"],
  //             as: "*.js",
  //         },
  //     },
  // },
  logging:
    process.env.NODE_ENV === "development"
      ? {
        fetches: {
          fullUrl: true
        }
      }
      : {},
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"]
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  }
};

console.log("next.config.js", JSON.stringify(module.exports, null, 2));

module.exports = nextConfig;
