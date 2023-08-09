<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h2>
    <slot />
  </h2>
</template>

<style lang="scss" scoped>
h2 {
  color: #1c567d;
  padding-bottom: 0.2em;
  margin-bottom: 0.75em;
  counter-increment: headline-2;
  counter-reset: headline-3;

  &:before {
    content: counter(headline-2, upper-roman) ' - ';
  }
}
</style>
