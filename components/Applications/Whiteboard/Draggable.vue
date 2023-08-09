<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string,
  defaultX?: number,
  defaultY?: number
}>(), {
  defaultX: 10,
  defaultY: 10
})

const emit = defineEmits<{(event: 'closed'): void}>()
// eslint-disable-next-line vue/no-setup-props-destructure
const x = ref(props.defaultX)
// eslint-disable-next-line vue/no-setup-props-destructure
const y = ref(props.defaultY)
const root = ref<HTMLElement | null>(null)
let deltaX = 0
let deltaY = 0

const dragMouseDown = (event: MouseEvent) => {
  event.preventDefault()
  deltaX = event.clientX - parseInt(root.value!.style.left.replace('px', ''))
  deltaY = event.clientY - parseInt(root.value!.style.top.replace('px', ''))
  x.value = event.clientX - deltaX
  y.value = event.clientY - deltaY
  root.value!.style.width = `${root.value!.offsetWidth}px`
  root.value!.style.height = `${root.value!.offsetHeight}px`
  document.onmousemove = elementDrag
  document.onmouseup = stopDragging
}

const elementDrag = (event: MouseEvent) => {
  event.preventDefault()
  x.value = event.clientX - deltaX
  y.value = event.clientY - deltaY
}

const stopDragging = () => {
  document.onmouseup = null
  document.onmousemove = null
  root.value!.style.removeProperty('width')
  root.value!.style.removeProperty('height')
}

const close = () => {
  root.value!.remove()
  emit('closed')
}
</script>

<template>
  <div ref="root" class="draggable card" :style="{'top': `${y}px`, 'left': `${x}px`}">
    <header class="card-header bg-dark text-white" @mousedown="dragMouseDown">
      <span class="card-title" v-text="title" />
      <button type="button" class="margin-left-auto btn-close btn-close-white" aria-label="Fermer" @click="close" />
    </header>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.draggable {
  position: absolute;

  .card-header {
    cursor: move;
    display: flex;
    justify-content: space-between;

    .card-title {
      overflow: hidden;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      margin-bottom: 0;
    }
  }

  .card-body {
    resize: both;
    overflow: hidden;
    min-width: 100px;
    min-height: 100px;
  }
}
</style>
