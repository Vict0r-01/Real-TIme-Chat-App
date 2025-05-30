/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/login',
          destination: 'http://localhost:8080/login',
        },
        {
          // WebSocket proxy configuration
          source: '/ws',
          destination: 'http://localhost:8080/ws',
        },
      ];
    },
  };
  
  export default nextConfig;