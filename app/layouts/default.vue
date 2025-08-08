<script setup lang="ts">
const theme = useUpdateTheme()
</script>

<template>
  <Html :data-bs-theme="theme">
    <nuxt-loading-indicator :color="theme === 'light' ? '#f2f4f6' : 'white'" />
    <page-navbar />
    <page-header />
    <page-content>
      <slot />
    </page-content>
    <page-footer />
  </Html>
</template>

<style lang="scss">
@import '~/assets/bootstrap-mixins';

@include color-mode(light) {
  body {
    background-color: #f8f8f8;
  }
}

@include color-mode(dark) {
  body {
    background-color: black;
  }
}
</style>
