<template>
  <page-content>
    <social-head :title="title" />
    <error-display :error-code="error.statusCode" />
  </page-content>
</template>

<script>
import PageContent from '../components/Page/PageContent'
import SocialHead from '../components/SocialHead'
import ErrorDisplay from '../components/ErrorDisplay'

export default {
  components: { ErrorDisplay, SocialHead, PageContent },
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  computed: {
    title () {
      return `Erreur ${this.error.statusCode}`
    }
  }
}
</script>
