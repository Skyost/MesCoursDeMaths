<template>
  <NuxtLayout>
    <page-head title="Erreur" />
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
  }
}
</script>
