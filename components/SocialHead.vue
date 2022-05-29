<template>
  <span v-if="false" />
</template>

<script>
import site from '~/site'

export default {
  name: 'SocialHead',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: site.site.description
    },
    openGraphImage: {
      type: String,
      default: `${site.site.url}/images/social/open-graph.png`
    },
    twitterCard: {
      type: String,
      default: 'summary'
    },
    twitterImage: {
      type: String,
      default: `${site.site.url}/images/social/twitter.png`
    }
  },
  head () {
    const currentAddress = `${site.site.url}${this.$route.path}`
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        {
          property: 'og:title',
          content: this.title
        },
        {
          property: 'og:description',
          content: this.description
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:site_name',
          content: site.site.title
        },
        {
          property: 'og:url',
          content: currentAddress
        },
        {
          property: 'og:image',
          content: this.openGraphImage
        },
        {
          property: 'og:locale',
          content: 'fr_FR'
        },

        {
          name: 'twitter:card',
          content: this.twitterCard
        },
        {
          name: 'twitter:title',
          content: this.title
        },
        {
          name: 'twitter:description',
          content: this.description
        },
        {
          name: 'twitter:site',
          content: '@hdelaunay_'
        },
        {
          name: 'twitter:creator',
          content: '@hdelaunay_'
        },
        {
          name: 'twitter:url',
          content: currentAddress
        },
        {
          name: 'twitter:image',
          content: this.twitterImage
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: this.$route.path
        }
      ]
    }
  }
}
</script>
