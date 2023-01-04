<template>
  <draggable
    class="draggable-text"
    title="Texte"
    :default-x="100 + index * 10"
    :default-y="100 + index * 10"
  >
    <textarea />
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
    }
  }
}
</script>

<style lang="scss">
.draggable-text .card-body {
  padding: 0;

  textarea {
    padding: 1rem;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
  }
}
</style>
