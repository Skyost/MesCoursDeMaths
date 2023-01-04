<template>
  <div class="draggable card" :style="{'top': `${y}px`, 'left': `${x}px`}">
    <header class="card-header bg-dark text-white" @mousedown="dragMouseDown">
      <span class="card-title" v-text="title" />
      <button type="button" class="margin-left-auto btn-close btn-close-white" aria-label="Fermer" @click="close" />
    </header>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    defaultX: {
      type: Number,
      default: 10
    },
    defaultY: {
      type: Number,
      default: 10
    }
  },
  emits: ['close'],
  data () {
    return {
      x: this.defaultX,
      y: this.defaultY,
      deltaX: 0,
      deltaY: 0
    }
  },
  methods: {
    dragMouseDown (event) {
      event.preventDefault()
      this.deltaX = event.clientX - parseInt(this.$el.style.left.replace('px', ''))
      this.deltaY = event.clientY - parseInt(this.$el.style.top.replace('px', ''))
      this.x = event.clientX - this.deltaX
      this.y = event.clientY - this.deltaY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag (event) {
      event.preventDefault()
      this.x = event.clientX - this.deltaX
      this.y = event.clientY - this.deltaY
    },
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    },
    close () {
      this.$el.remove()
      this.$emit('close')
    }
  }
}
</script>

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
