<script setup>
import { nextTick, onBeforeMount, onMounted } from 'vue'
import { toRefs } from '@vue/reactivity'
import { useNuxtApp } from '#app'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

const { title, to, depth } = toRefs(props)

const { $bus } = useNuxtApp()
onBeforeMount(() => {
  $bus.$emit('clearNavigation')
})
onMounted(async () => {
  await nextTick()
  $bus.$emit('navigation', { title, to, depth })
})
</script>

<template>
  <span v-if="false" />
</template>
