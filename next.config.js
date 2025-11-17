const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
          {
            source: "/_fah/image/:path*",
            destination:
              "https://us-central1-studio-9217724895-dd75b.cloudfunctions.net/ext-firebase-app-hosting-img-proc-handler/:path*",
          },
       ];
     },
    webpack: (config) => {
        config.resolve.alias['@'] = path.join(__dirname, 'src');
        return config;
    },
};

module.exports = nextConfig;
