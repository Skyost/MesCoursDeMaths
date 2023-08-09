<script setup lang="ts">
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  index?: number,
  data: string
}>(), {
  index: 0
})

const emit = defineEmits<{(event: 'closed'): void}>()
</script>

<template>
  <draggable
    title="Image"
    class="draggable-image"
    :default-x="300 + index * 10"
    :default-y="300 + index * 10"
    @closed="emit('closed')"
  >
    <img :src="data" alt="Image">
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
