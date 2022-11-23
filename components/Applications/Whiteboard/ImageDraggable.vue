<template>
  <draggable
    title="Image"
    class="draggable-image"
    :default-x="300 + index * 10"
    :default-y="300 + index * 10"
    @close="$emit('close')"
  >
    <img :src="data" alt="Image">
  </draggable>
</template>

<script>
import Draggable from '~/components/Applications/Whiteboard/Draggable'

export default {
  name: 'PdfDraggable',
  components: { Draggable },
  props: {
    index: {
      type: Number,
      default: 0
    },
    data: {
      type: String,
      required: true
    }
  },
  emits: ['close']
}
</script>

<style lang="scss">
.draggable-image .card-body {
  padding: 0 0 14px 0;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
