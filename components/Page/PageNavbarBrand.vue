<script setup lang="ts">
import { siteMeta } from '~/site/meta'
</script>

<template>
  <ski-navbar-brand>
    <img class="logo" src="/images/logo.svg" alt="Logo">
    <nuxt-link class="navbar-brand" to="/">{{ siteMeta.title }}</nuxt-link>
  </ski-navbar-brand>
</template>

<style lang="scss" scoped>
.logo {
  height: 1.5em;
  vertical-align: -0.4em;
}

.navbar-brand {
  margin-left: var(--bs-navbar-brand-margin-end);
}
</style>
