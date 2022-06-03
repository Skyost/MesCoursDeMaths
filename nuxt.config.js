import 'dotenv/config'
import site from './site'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s | ${site.site.title}`,
    htmlAttrs: {
      lang: 'fr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: site.site.description },
      { name: 'theme-color', content: '#343a40' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  googleFonts: {
    families: {
      Montserrat: true,
      Raleway: true
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/fonts.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '~/modules/generate-content',
    '~/modules/sitemap-dynamic-routes',
    '@nuxtjs/google-fonts',
    '@nuxtjs/web-vitals'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
    'skimple-components/nuxt'
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    liveEdit: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  generate: {
    dir: 'dist'
  },

  router: {
    base: new URL(site.site.url).pathname
  },

  loading: {
    color: '#009688'
  },

  axios: {
    credentials: true,
    baseURL: site.site.url,
    browserBaseURL: site.site.url
  },

  robots: {
    UserAgent: '*',
    Disallow: ['/api/', '/_nuxt/'],
    Sitemap: `${site.site.url}/sitemap.xml`
  },

  sitemap: {
    hostname: site.site.url,
    defaults: {
      priority: 1,
      lastmod: new Date()
    }
  }
}
