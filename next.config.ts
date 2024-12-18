import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack(config, { isServer }) {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      // Adiciona um fallback para os módulos `fs` no lado do cliente
      config.resolve.fallback = {
        dns: false,
        fs: false,
        net: false,
        tls: false,
      };
    } else {
      // Se for no lado do servidor, podemos permitir o uso dos módulos
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };
    }

    return config;
  },
};

export default nextConfig;
