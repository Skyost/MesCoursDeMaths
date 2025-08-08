<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const title = computed(() => {
  let result = 'Erreur'
  if ((Object.hasOwnProperty.call(props.error, 'statusCode'))) {
    result += ` ${props.error.statusCode}`
  }
  return result
})

usePageHead({ title })
</script>

<template>
  <nuxt-layout>
    <Title>{{ title }}</Title>
    <error-display :error="error" />
  </nuxt-layout>
</template>
