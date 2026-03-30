/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuration pour le rendu
  reactStrictMode: true,

  // Configuration pour le compilateur
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Configuration pour les expérimentales
  experimental: {
    // Optimiser les imports de packages
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  // Configuration pour les en-têtes HTTP
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache statique pour les images
        source: "/products/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Configuration pour les redirections
  async redirects() {
    return [];
  },

  // Configuration pour les réécritures
  async rewrites() {
    return [];
  },

  // Configuration pour le bundle
  webpack: (config, { isServer }) => {
    // Configuration pour Three.js
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });

    // Ignorer les avertissements de Three.js
    config.ignoreWarnings = [
      { module: /node_modules\/three/ },
      { module: /node_modules\/@react-three/ },
    ];

    // Optimisation pour le client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },

  // Configuration pour le output
  output: "standalone",

  // Configuration pour le trailing slash
  trailingSlash: false,

  // Configuration pour le powered by header
  poweredByHeader: false,

  // Configuration pour le compress
  compress: true,

  // Configuration pour le generateEtags
  generateEtags: true,

  // Configuration pour le pageExtensions
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // Configuration pour le transpilePackages
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

module.exports = nextConfig;
