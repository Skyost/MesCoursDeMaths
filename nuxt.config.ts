import { defineNuxtConfig } from 'nuxt/config'
import StylelintPlugin from 'vite-plugin-stylelint'
import eslintPlugin from '@nabla/vite-plugin-eslint'
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
  modules: [
    '@nuxt/eslint',
    'nuxt-cname-generator',
    '~/modules/commit-sha-file-generator',
    '~/modules/content-downloader',
    '~/modules/latex-pdf-generator',
    '~/modules/nuxt-content-latex',
    '@bootstrap-vue-next/nuxt',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    'nuxt-link-checker',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/icon'
    // '@nuxt/image'
  ],

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

  site: {
    url: siteMeta.url,
    name: siteMeta.title,
    trailingSlash: true
  },

  content: {
    watch: false
  },

  runtimeConfig: {
    public: {
      githubClientId: authentication.clientId,
      url,
      apiUrl
    }
  },

  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append'
      }
    }
  },
  compatibilityDate: '2024-07-01',

  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  vite: {
    plugins: [
      StylelintPlugin(),
      eslintPlugin()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
        }
      }
    }
  },

  cname: {
    host: siteMeta.url
  },

  commitShaFileGenerator: {
    fileName: 'latest-commit.json'
  },

  eslint: {
    config: {
      stylistic: true
    }
  },

  googleFonts: {
    display: 'swap',
    families: {
      Montserrat: true,
      Raleway: true
    }
  },

  icon: {
    provider: 'iconify',
    class: 'vue-icon'
  },

  linkChecker: {
    failOnError: false,
    excludeLinks: [
      '/pdf/**'
    ],
    skipInspections: [
      'link-text',
      'no-uppercase-chars'
    ]
  },

  sitemap: {
    exclude: [
      '/prof/agenda/',
      '/prof/cours/',
      '/prof/tableau-blanc/'
    ]
  }
})
