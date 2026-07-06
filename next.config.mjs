/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
