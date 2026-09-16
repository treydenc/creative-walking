/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // This suppresses the hydration warning in development
    onDemandEntries: {
      // Optional: configure how long a page should stay in memory
      maxInactiveAge: 25 * 1000,
      // Optional: configure how many pages should be kept in memory
      pagesBufferLength: 2,
    },
  }
  
  export default nextConfig;