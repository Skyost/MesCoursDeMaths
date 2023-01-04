<template>
  <ski-navbar-brand>
    <img class="logo" src="/images/logo.svg" alt="Logo">
    <nuxt-link class="navbar-brand" to="/">{{ title }}</nuxt-link>
  </ski-navbar-brand>
</template>

<script>
import siteMeta from '~/site/meta'

export default {
  computed: {
    title () {
      return siteMeta.title
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 1.5em;
  vertical-align: -0.4em;
}

.navbar-brand {
  margin-left: var(--bs-navbar-brand-margin-end);
}
</style>
