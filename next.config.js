/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false
  },
  images: {
    domains: ['images.unsplash.com', 'imgix.cosmicjs.com']
  }
}

module.exports = nextConfig