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

const theme = useTheme()
</script>

<template>
  <b-button
    :variant="theme === 'light' ? 'light' : 'dark'"
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
