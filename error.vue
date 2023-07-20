<template>
  <NuxtLayout>
    <page-head :title="title" />
    <error-display :error="error" />
  </NuxtLayout>
</template>

<script>
import ErrorDisplay from './components/ErrorDisplay'
import PageHead from './components/Page/PageHead'

export default {
  components: { PageHead, ErrorDisplay },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  computed: {
    title () {
      let result = 'Erreur'
      if ((Object.hasOwnProperty.call(this.error, 'statusCode'))) {
        result += ` ${this.error.errorCode}`
      }
      return result
    }
  }
}
</script>
