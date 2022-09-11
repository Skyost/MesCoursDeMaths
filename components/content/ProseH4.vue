<template>
  <h4>
    <slot />
  </h4>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  border-bottom: none;
  margin-bottom: 0;
}
</style>
