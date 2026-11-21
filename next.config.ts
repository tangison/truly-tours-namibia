import type { NextConfig } from "next";

/**
 * Truly Tours Namibia — static export for GitHub Pages (user site).
 * The page is a single-page site with no server routes, so `next build`
 * emits a fully static `out/` folder that GitHub Pages serves directly.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;
