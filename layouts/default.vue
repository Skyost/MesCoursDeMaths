<template>
  <div>
    <NuxtLoadingIndicator color="#f2f4f6" />
    <page-navbar />
    <page-header />
    <page-content>
      <slot />
    </page-content>
    <page-footer />
  </div>
</template>

<script>
import PageNavbar from '~/components/Page/PageNavbar'
import PageContent from '~/components/Page/PageContent'
import PageFooter from '~/components/Page/PageFooter'
import PageHeader from '~/components/Page/PageHeader'

export default {
  components: { PageHeader, PageFooter, PageContent, PageNavbar }
}
</script>
