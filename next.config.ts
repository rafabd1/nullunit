import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Opção correta para pacotes externos
  serverExternalPackages: ['contentlayer/generated']
};

export default withContentlayer(nextConfig);
