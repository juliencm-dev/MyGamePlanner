/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "cdn.discordapp.com", "mygameplanner.s3.ca-central-1.amazonaws.com", "utfs.io"],
  },
  output: "standalone",
};

export default nextConfig;
