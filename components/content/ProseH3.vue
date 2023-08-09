<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h3>
    <slot />
  </h3>
</template>

<style lang="scss" scoped>
h3 {
  color: #2980b9;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 0.75em;
  counter-increment: headline-3;

  &::before {
    content: counter(headline-3) '. ';
  }
}
</style>
