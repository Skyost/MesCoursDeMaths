<template>
  <img :src="src" :alt="alt" :width="width" :height="height">
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: undefined
    },
    height: {
      type: [String, Number],
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
img.tikz-image {
  max-width: 100%;
}
</style>
