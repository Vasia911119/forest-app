/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript строгість
  typescript: {
    // Включаємо строгий режим TypeScript
    strict: true,
  },

  // ESLint конфігурація
  eslint: {
    dirs: ["src"],
  },

  // Експериментальні функції
  experimental: {
    optimizePackageImports: ["lodash", "chart.js"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Оптимізація зображень
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aawcrghnjzsmklebgdcw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Безпека
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Переадресація
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Webpack оптимізації
  webpack: (config, { isServer }) => {
    // Оптимізація bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Зменшення розміру lodash
    config.resolve.alias = {
      ...config.resolve.alias,
      lodash: "lodash-es",
    };

    return config;
  },

  // Налаштування для продакшену
  compress: true,
  poweredByHeader: false,

  // Логування
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
