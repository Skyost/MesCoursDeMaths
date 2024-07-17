<script setup lang="ts">
withDefaults(
  defineProps<{
    iconId?: string | null
    to?: string
    href?: string
    text: string
  }>(),
  {
    iconId: 'arrow-left'
  }
)
</script>

<template>
  <b-button
    variant="light"
    :to="to"
    :href="href"
  >
    <icon
      v-if="iconId"
      :name="`bi:${iconId}`"
    /> {{ text }}
  </b-button>
</template>
