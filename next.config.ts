import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o Prisma quebre no build da Vercel
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],

  typescript: {
    ignoreBuildErrors: true,
  },

  // Desativa verificação estrita do React se houver conflito de versão
  reactStrictMode: false,
};

export default nextConfig;
