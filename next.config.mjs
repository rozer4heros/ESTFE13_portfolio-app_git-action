/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lbewackclcjjrdazaaym.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
