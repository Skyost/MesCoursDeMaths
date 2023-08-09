<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h4>
    <slot />
  </h4>
</template>

<style lang="scss" scoped>
h4 {
  border-bottom: none !important;
  margin-bottom: 0 !important;
}
</style>
