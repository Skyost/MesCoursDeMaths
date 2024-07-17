<script setup lang="ts">
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  defaultX?: number
  defaultY?: number
}>(), {
  defaultX: 10,
  defaultY: 10
})
</script>

<template>
  <draggable
    class="draggable-text"
    title="Texte"
    :default-x="defaultX"
    :default-y="defaultY"
  >
    <textarea />
  </draggable>
</template>

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
