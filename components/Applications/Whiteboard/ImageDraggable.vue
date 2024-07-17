<script setup lang="ts">
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  defaultX?: number
  defaultY?: number
  data: string
}>(), {
  defaultX: 10,
  defaultY: 10
})

const emit = defineEmits<{ (event: 'closed'): void }>()
</script>

<template>
  <draggable
    title="Image"
    class="draggable-image"
    :default-x="defaultX"
    :default-y="defaultY"
    @closed="emit('closed')"
  >
    <img
      :src="data"
      alt="Image"
    >
  </draggable>
</template>

<style lang="scss">
.draggable-image .card-body {
  padding: 0 0 14px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
