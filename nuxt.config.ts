import { defineNuxtConfig } from 'nuxt/config'
import StylelintPlugin from 'vite-plugin-stylelint'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import 'dotenv/config'
import { siteMeta } from './site/meta'
import { debug } from './site/debug'
import { authentication } from './site/authentication'

let url = siteMeta.url
let apiUrl = siteMeta.apiUrl
if (debug) {
  url = 'http://localhost:3000'
  apiUrl = 'http://localhost:3000/api'
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
    '@nuxt/eslint',
    'nuxt-cname-generator',
    '~/modules/commit-sha-file-generator',
    '~/modules/content-downloader',
    '~/modules/latex-pdf-generator',
    '~/modules/nuxt-content-latex',
    'skimple-components/nuxt',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    'nuxt-link-checker',
    '@nuxtjs/sitemap',
    'nuxt-simple-robots'
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

  site: {
    url,
    name: siteMeta.title,
    trailingSlash: true
  },

  sitemap: {
    exclude: [
      '/prof/agenda/',
      '/prof/cours/',
      '/prof/tableau-blanc/'
    ]
  },

  linkChecker: {
    failOnError: false,
    excludeLinks: [
      '/pdf/**'
    ],
    skipInspections: [
      'link-text'
    ]
  },

  commitShaFileGenerator: {
    fileName: 'latest-commit.json'
  },

  cname: {
    host: url
  },

  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append'
      }
    }
  }
})
