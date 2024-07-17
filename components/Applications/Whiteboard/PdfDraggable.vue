<script setup lang="ts">
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  index?: number
  data: string
}>(), {
  index: 0
})

const emit = defineEmits<{ (event: 'closed'): void }>()
</script>

<template>
  <draggable
    class="draggable-pdf"
    title="Document PDF"
    :default-x="200 + index * 10"
    :default-y="200 + index * 10"
    @closed="emit('closed')"
  >
    <object
      :data="data"
      type="application/pdf"
    />
  </draggable>
</template>

<style lang="scss">
.draggable-pdf .card-body {
  padding: 0 0 14px;

  object {
    width: 100%;
    height: 100%;
  }
}
</style>
