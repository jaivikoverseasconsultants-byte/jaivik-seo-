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
  async redirects() {
    return [
      { source: '/student-portal/login', destination: '/student-portal', permanent: false },
      { source: '/student-portal/register', destination: '/student-portal', permanent: false },
      { source: '/universities/tu-munich', destination: '/universities/technical-university-of-munich', permanent: true },
      { source: '/universities/tu-munich/courses', destination: '/universities/technical-university-of-munich/courses', permanent: true },
      { source: '/universities/nus', destination: '/universities/national-university-of-singapore', permanent: true },
      { source: '/universities/nus/courses', destination: '/universities/national-university-of-singapore/courses', permanent: true },
      { source: '/universities/ucl', destination: '/universities/university-college-london', permanent: true },
      { source: '/universities/ucl/courses', destination: '/universities/university-college-london/courses', permanent: true },
      { source: '/universities/lse', destination: '/universities/london-school-of-economics', permanent: true },
      { source: '/universities/lse/courses', destination: '/universities/london-school-of-economics/courses', permanent: true },
      { source: '/universities/ubc', destination: '/universities/university-of-british-columbia', permanent: true },
      { source: '/universities/ubc/courses', destination: '/universities/university-of-british-columbia/courses', permanent: true },
      { source: '/universities/mit', destination: '/universities/mit-massachusetts', permanent: true },
      { source: '/universities/ntu', destination: '/universities/nanyang-technological-university', permanent: true },
      { source: '/universities/victoria-university-of-wellington', destination: '/universities/victoria-university-wellington', permanent: true },
      { source: '/universities/victoria-university-of-wellington/courses', destination: '/universities/victoria-university-wellington/courses', permanent: true },
      { source: '/universities/victoria-university-of-wellington/courses/:slug*', destination: '/universities/victoria-university-wellington/courses/:slug*', permanent: true },

      // 2026-07-15: GSC crawl-budget cleanup. The 2026-07-13 CURATED/MIXED-data
      // prune (see BUILD-LOG.md) deleted 28 universities' /courses route trees
      // outright, leaving their previously-indexed course URLs 404ing. Every
      // pruned course URL now redirects to the closest real destination — that
      // university's own profile page where one exists, the same institution's
      // real page under a different slug where the pruned slug was just a
      // spelling variant, or the relevant country page as a last resort (never
      // the homepage).

      // Own profile page exists under the same slug:
      { source: '/universities/macquarie-university/courses', destination: '/universities/macquarie-university', permanent: true },
      { source: '/universities/macquarie-university/courses/:path*', destination: '/universities/macquarie-university', permanent: true },
      { source: '/universities/cquniversity/courses', destination: '/universities/cquniversity', permanent: true },
      { source: '/universities/cquniversity/courses/:path*', destination: '/universities/cquniversity', permanent: true },
      { source: '/universities/jcu-brisbane/courses', destination: '/universities/jcu-brisbane', permanent: true },
      { source: '/universities/jcu-brisbane/courses/:path*', destination: '/universities/jcu-brisbane', permanent: true },
      { source: '/universities/bits-pilani-dubai/courses', destination: '/universities/bits-pilani-dubai', permanent: true },
      { source: '/universities/bits-pilani-dubai/courses/:path*', destination: '/universities/bits-pilani-dubai', permanent: true },
      { source: '/universities/bond-university/courses', destination: '/universities/bond-university', permanent: true },
      { source: '/universities/bond-university/courses/:path*', destination: '/universities/bond-university', permanent: true },
      { source: '/universities/nyit-vancouver/courses', destination: '/universities/nyit-vancouver', permanent: true },
      { source: '/universities/nyit-vancouver/courses/:path*', destination: '/universities/nyit-vancouver', permanent: true },
      { source: '/universities/rit-dubai/courses', destination: '/universities/rit-dubai', permanent: true },
      { source: '/universities/rit-dubai/courses/:path*', destination: '/universities/rit-dubai', permanent: true },
      { source: '/universities/concordia-university/courses', destination: '/universities/concordia-university', permanent: true },
      { source: '/universities/concordia-university/courses/:path*', destination: '/universities/concordia-university', permanent: true },
      { source: '/universities/university-of-guelph/courses', destination: '/universities/university-of-guelph', permanent: true },
      { source: '/universities/university-of-guelph/courses/:path*', destination: '/universities/university-of-guelph', permanent: true },
      { source: '/universities/national-university-of-singapore/courses', destination: '/universities/national-university-of-singapore', permanent: true },
      { source: '/universities/national-university-of-singapore/courses/:path*', destination: '/universities/national-university-of-singapore', permanent: true },
      { source: '/universities/university-of-victoria/courses', destination: '/universities/university-of-victoria', permanent: true },
      { source: '/universities/university-of-victoria/courses/:path*', destination: '/universities/university-of-victoria', permanent: true },

      // Same real institution, profile page lives under a different slug:
      { source: '/universities/university-of-new-south-wales/courses', destination: '/universities/unsw-sydney', permanent: true },
      { source: '/universities/university-of-new-south-wales/courses/:path*', destination: '/universities/unsw-sydney', permanent: true },
      { source: '/universities/georgia-institute-of-technology/courses', destination: '/universities/georgia-tech', permanent: true },
      { source: '/universities/georgia-institute-of-technology/courses/:path*', destination: '/universities/georgia-tech', permanent: true },
      { source: '/universities/assiniboine-college/courses', destination: '/universities/assiniboine-community-college', permanent: true },
      { source: '/universities/assiniboine-college/courses/:path*', destination: '/universities/assiniboine-community-college', permanent: true },
      { source: '/universities/columbia-college/courses', destination: '/universities/columbia-college-bc', permanent: true },
      { source: '/universities/columbia-college/courses/:path*', destination: '/universities/columbia-college-bc', permanent: true },
      { source: '/universities/delft-university-of-technology/courses', destination: '/universities/tu-delft', permanent: true },
      { source: '/universities/delft-university-of-technology/courses/:path*', destination: '/universities/tu-delft', permanent: true },
      { source: '/universities/eindhoven-university-of-technology/courses', destination: '/universities/tu-eindhoven', permanent: true },
      { source: '/universities/eindhoven-university-of-technology/courses/:path*', destination: '/universities/tu-eindhoven', permanent: true },
      { source: '/universities/humboldt-university-of-berlin/courses', destination: '/universities/humboldt-university-berlin', permanent: true },
      { source: '/universities/humboldt-university-of-berlin/courses/:path*', destination: '/universities/humboldt-university-berlin', permanent: true },
      { source: '/universities/justice-institute-of-bc/courses', destination: '/universities/justice-institute-bc', permanent: true },
      { source: '/universities/justice-institute-of-bc/courses/:path*', destination: '/universities/justice-institute-bc', permanent: true },
      { source: '/universities/niagara-university/courses', destination: '/universities/niagara-university-ontario', permanent: true },
      { source: '/universities/niagara-university/courses/:path*', destination: '/universities/niagara-university-ontario', permanent: true },
      { source: '/universities/nscc/courses', destination: '/universities/nova-scotia-community-college', permanent: true },
      { source: '/universities/nscc/courses/:path*', destination: '/universities/nova-scotia-community-college', permanent: true },
      { source: '/universities/free-university-of-berlin/courses', destination: '/universities/free-university-berlin', permanent: true },
      { source: '/universities/free-university-of-berlin/courses/:path*', destination: '/universities/free-university-berlin', permanent: true },
      { source: '/universities/united-arab-emirates-university/courses', destination: '/universities/uae-university', permanent: true },
      { source: '/universities/united-arab-emirates-university/courses/:path*', destination: '/universities/uae-university', permanent: true },
      { source: '/universities/fairleigh-dickinson-university-vancouver/courses', destination: '/universities/fdu-vancouver', permanent: true },
      { source: '/universities/fairleigh-dickinson-university-vancouver/courses/:path*', destination: '/universities/fdu-vancouver', permanent: true },

      // No real profile page exists anywhere on the site for these — redirect
      // to the relevant country page (real, relevant), not the homepage:
      { source: '/universities/bangor-university/courses', destination: '/universities/country/united-kingdom', permanent: true },
      { source: '/universities/bangor-university/courses/:path*', destination: '/universities/country/united-kingdom', permanent: true },
      { source: '/universities/umass-amherst/courses', destination: '/universities/country/usa', permanent: true },
      { source: '/universities/umass-amherst/courses/:path*', destination: '/universities/country/usa', permanent: true },
      { source: '/universities/university-of-northampton/courses', destination: '/universities/country/united-kingdom', permanent: true },
      { source: '/universities/university-of-northampton/courses/:path*', destination: '/universities/country/united-kingdom', permanent: true },
      { source: '/universities/laurentian-university/courses', destination: '/universities/country/canada', permanent: true },
      { source: '/universities/laurentian-university/courses/:path*', destination: '/universities/country/canada', permanent: true },

      // 2026-07-16: ANU "Civil Engineering" course pages were CURATED data
      // (added 2026-05-30, bare-homepage URL) dropped by the 2026-07-09
      // Wave 3 real-data replacement. Re-checked ANU's live program-search
      // API directly — it has no civil/structural/infrastructure engineering
      // program at any level (only Electrical Engineering at Master's) — so
      // there is no real page to rebuild. Redirect to ANU's real profile page.
      { source: '/universities/australian-national-university/courses/anu-msc-civil-engineering', destination: '/universities/australian-national-university', permanent: true },
      { source: '/universities/australian-national-university/courses/anu-beng-civil-engineering', destination: '/universities/australian-national-university', permanent: true },
    ];
  },
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com wss://*.firebaseio.com https://*.firebaseio.com https://formspree.io",
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
