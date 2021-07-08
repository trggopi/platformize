var PrismaClient = require('@prisma/client')
let prisma = new PrismaClient.PrismaClient()

const customDomainToSubdomain = async (customDomain) => {
  const subdomain = await prisma.publication.findUnique({
    where: {
      customDomain: customDomain
    },
    select: {
      url: true
    }
  })
  return subdomain.url
}

module.exports = {
    images: {
      domains: ['og-image.vercel.app']
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    async redirects() {
      return [
        {
          source: '/publication',
          destination: '/',
          permanent: true,
        },
      ]
    },
    async redirects() {
      return [
        {
          source: '/post',
          destination: '/',
          permanent: true,
        },
      ]
    },
    async rewrites() {
        return [
            /* {
                source: '/(.*)',
                has: [{
                    type: 'host',
                    value: 'app.platformize.co'
                }],
                destination: '/app*',
            }, */
            {
                source: '/',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)\\.platformize\\.co'
                }],
                destination: '/:url',
            },
            {
                source: '/p/:slug',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)\\.platformize\\.co'
                }],
                destination: '/:url/p/:slug',
            },
            {
                source: '/:path',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)\\.platformize\\.co'
                }],
                destination: '/:url/:path',
            },
            {
                source: '/',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)'
                }],
                destination: `/${customDomainToSubdomain(`<url>`)}`,
            },
        ]
    },
}