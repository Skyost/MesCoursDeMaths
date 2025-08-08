import { defineNuxtConfig } from 'nuxt/config'
import StylelintPlugin from 'vite-plugin-stylelint'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import siteMeta from './app/site/meta'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'nuxt-cname-generator',
    '~/../modules/commit-sha-file-generator',
    '~/../modules/content-downloader',
    '~/../modules/latex-pdf-generator',
    '~/../modules/latex-to-content',
    '@bootstrap-vue-next/nuxt',
    '@nuxtjs/google-fonts',
    'nuxt-link-checker',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/icon'
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
    '~/assets/app.scss'
  ],

  site: {
    url: siteMeta.url,
    name: siteMeta.title,
    trailingSlash: true
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
          api: 'modern-compiler',
          silenceDeprecations: [
            'mixed-decls',
            'color-functions',
            'global-builtin',
            'import'
          ]
        }
      }
    }
  },

  commitShaFileGenerator: {
    directory: 'node_modules/.commit-sha-file-generator/'
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
  }
})
