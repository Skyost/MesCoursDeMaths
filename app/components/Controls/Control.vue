<script setup lang="ts">
withDefaults(
  defineProps<{
    iconId?: string | null
    to?: string
    href?: string
    text: string
    active?: boolean
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
    :active="active"
  >
    <icon
      v-if="iconId"
      :name="`bi:${iconId}`"
    /> {{ text }}
  </b-button>
</template>
