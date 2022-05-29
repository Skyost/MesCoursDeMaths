<template>
  <header class="page-header">
    <ski-container>
      <img class="page-header-image" src="/images/header.svg" alt="Header">
      <h1 class="m-3" v-text="title" />
      <hr>
      <p class="mb-0" v-text="tagline" />
    </ski-container>
  </header>
</template>

<script>
import { SkiContainer } from 'skimple-components'
import site from '~/site'

export default {
  name: 'PageHeader',
  components: { SkiContainer },
  computed: {
    title () {
      return site.site.title
    },
    tagline () {
      return site.site.tagline
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  position: relative;
  color: white;
  text-align: center;
  background-color: var(--bs-gray-dark);
  padding: 40px;

  .page-header-image {
    width: 90%;
    max-width: 400px;
  }

  > * {
    z-index: 2;
  }

  hr {
    opacity: 1;
  }
}
</style>
