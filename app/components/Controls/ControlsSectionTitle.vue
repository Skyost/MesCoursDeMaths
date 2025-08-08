<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    iconId?: string
  }>(),
  {
    title: 'Navigation',
    iconId: 'list'
  }
)
</script>

<template>
  <span class="title"><icon :name="`bi:${iconId}`" /> {{ title }}</span>
</template>

<style scoped lang="scss">
.title {
  flex-basis: 100%;
  text-align: right;
  font-size: 0.8em;
  margin-bottom: 4px;
}
</style>
