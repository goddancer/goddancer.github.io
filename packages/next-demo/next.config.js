/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // assetPrefix: ".",
  // images: {
  //   loader: "imgix",
  //   path: "/",
  // },
  // exportPathMap: function () {
  //   return {
  //     // '/': { page: '/' },
  //     // '/blog/nextjs': { page: '/blog/[post]/comment/[id]' },        // wrong
  //     // '/articles/1': { page: '/articles/[id]' }, // correct
  //   }
  // },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
}

module.exports = nextConfig
