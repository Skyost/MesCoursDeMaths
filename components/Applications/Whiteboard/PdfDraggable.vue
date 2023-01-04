<template>
  <draggable
    class="draggable-pdf"
    title="Document PDF"
    :default-x="200 + index * 10"
    :default-y="200 + index * 10"
    @close="$emit('close')"
  >
    <object :data="data" type="application/pdf" />
  </draggable>
</template>

<script>
import Draggable from '~/components/Applications/Whiteboard/Draggable'

export default {
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
.draggable-pdf .card-body {
  padding: 0 0 14px;

  object {
    width: 100%;
    height: 100%;
  }
}
</style>
