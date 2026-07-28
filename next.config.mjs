/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  // 2026-07-16: all URL redirects moved to vercel.json. next.config.mjs's
  // `redirects()` (and `rewrites()`) are silently no-ops in production —
  // Next.js only applies them when `hasNextSupport` is true (it checks
  // `process.env.NOW_BUILDER`, an internal signal set only by Vercel's
  // first-party @vercel/next builder), and this project's Vercel deployment
  // doesn't run through that path, so every redirect defined here 404'd live
  // despite compiling cleanly into `.next/routes-manifest.json` and passing
  // every local build/tsc/audit check — those checks all validate the Next.js
  // build artifact, not what Vercel actually serves. Discovered via the ANU
  // civil-engineering redirect (commit 04863b96) returning 404 in production.
  // See vercel.json for the full, currently-live redirect list.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // https://www.googletagmanager.com serves GA4's gtag.js loader (measurement ID G-6NKH1JP37G, app/layout.tsx) -- not an actual GTM container.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://apis.google.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              // https://*.google-analytics.com covers www.google-analytics.com and region-specific hosts (e.g. region1.google-analytics.com).
              "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com wss://*.firebaseio.com https://*.firebaseio.com https://formspree.io https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com",
              "frame-src 'self' https://*.firebaseapp.com https://www.google.com https://accounts.google.com",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          { key: "Access-Control-Allow-Origin", value: "https://study.jaivikoverseasconsultants.com" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
