<script setup>
import { nextTick, onBeforeMount, onMounted } from 'vue'
import { toRefs } from '@vue/reactivity'
import { useNuxtApp } from '#app'

// eslint-disable-next-line vue/valid-define-props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
})

const { title, to } = toRefs(props)

const { $bus } = useNuxtApp()
onBeforeMount(() => {
  $bus.$emit('clearNavigation')
})
onMounted(async () => {
  await nextTick()
  $bus.$emit('navigation', { title, to })
})
</script>

<template>
  <span v-if="false" />
</template>
