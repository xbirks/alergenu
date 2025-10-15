/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: "/_fah/image/:path*",
            destination:
              "https://us-central1-studio-9217724895-dd75b.cloudfunctions.net/ext-firebase-app-hosting-img-proc-handler/:path*",
          },
        ];
      },
      images: {
        loader: "custom",
        loaderFile: "./loader.js",
      },
};

module.exports = nextConfig;
