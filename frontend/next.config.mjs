/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/login',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/login`,
        },
        {
          // WebSocket proxy configuration
          source: '/ws',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/ws`,
        },
      ];
    },
  };
  
  export default nextConfig;