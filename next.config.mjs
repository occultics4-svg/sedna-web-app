/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline critical CSS to eliminate the render-blocking stylesheet request.
  // Requires the `critters` package (peer dep of Next's optimizeCss).
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
