/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    skipTrailingSlashRedirect: true, // Required for PostHog proxy
    async rewrites() {
      return {
        beforeFiles: [
          // Proxy PostHog ingestion to avoid ad blockers
          {
            source: "/ingest/static/:path*",
            destination: "https://us-assets.i.posthog.com/static/:path*",
          },
          {
            source: "/ingest/:path*",
            destination: "https://us.i.posthog.com/:path*",
          },
          {
            source: "/ingest",
            destination: "https://us.i.posthog.com",
          },
          {
            source: "/ingest/decide",
            destination: "https://us.i.posthog.com/decide",
          }
        ],
      };
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/200/**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            port: '',
            pathname: '/**'
          }
        ],
    },
    async headers() {
      return [
        {
          // Apply to all routes
          source: '/:path*',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https://img.clerk.com https://picsum.photos",
                "font-src 'self' data:",
                "connect-src 'self' https://*.convex.cloud https://*.clerk.com wss://*.convex.cloud https://us.i.posthog.com https://us-assets.i.posthog.com",
                "frame-ancestors 'none'",
              ].join('; '),
            },
          ],
        },
        {
          // API routes get additional headers
          source: '/api/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, max-age=0',
            },
          ],
        },
      ];
    },
};

export default nextConfig;
