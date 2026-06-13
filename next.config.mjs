/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "upload.wikimedia.org"],
  },
  async redirects() {
    return [
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
      { source: '/universities/mit', destination: '/universities/massachusetts-institute-of-technology', permanent: true },
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
