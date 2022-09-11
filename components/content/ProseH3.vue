<template>
  <h3>
    <slot />
  </h3>
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
h3 {
  color: #2980b9;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 0.75em;
}
</style>
