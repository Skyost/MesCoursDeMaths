import { defineNuxtConfig } from 'nuxt/config'
import StylelintPlugin from 'vite-plugin-stylelint'
import eslintPlugin from 'vite-plugin-eslint'
import 'dotenv/config'
import siteMeta from './site/meta'
import debug from './site/debug'
import authentication from './site/authentication'

let url = siteMeta.url
let apiUrl = siteMeta.apiUrl
if (debug.debug) {
  url = 'http://localhost:3000'
  apiUrl = 'http://localhost:3000/api'
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  ssr: true,

  app: {
    head: {
      titleTemplate: `%s | ${siteMeta.title}`,
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { name: 'description', content: siteMeta.description },
        { name: 'theme-color', content: '#0d47a1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: [
    '~/assets/app.scss',
    '~/node_modules/katex/dist/katex.min.css'
  ],

  vite: {
    plugins: [
      StylelintPlugin(),
      eslintPlugin()
    ]
  },

  modules: [
    '~/modules/generate-content',
    '~/modules/generate-commit-sha-file',
    '~/modules/generate-cname',
    'skimple-components/nuxt',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    '~/modules/generate-sitemap'
  ],

  runtimeConfig: {
    public: {
      url,
      apiUrl,
      githubClientId: authentication.clientId
    }
  },

  content: {
    watch: false
  },

  googleFonts: {
    display: 'swap',
    families: {
      Montserrat: true,
      Raleway: true
    }
  },

  skimpleComponents: {
    bootstrapCss: false,
    bootstrapJs: false
  },

  sitemap: {
    hostname: url,
    exclude: [
      '/404',
      '/prof/agenda',
      '/prof/cours',
      '/prof/tableau-blanc'
    ]
  },

  cname: {
    hostname: url
  }
})
