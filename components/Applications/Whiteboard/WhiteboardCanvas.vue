<template>
  <div ref="parent" class="parent">
    <canvas
      ref="canvas"
      class="canvas"
      :class="{ 'enabled': enabled }"
      @mousedown="onDrawStart"
      @mousemove="onDraw"
      @mouseup="onDrawEnd"
      @mouseleave="onDrawEnd"
      @touchstart="onDrawStart"
      @touchmove="onDraw"
      @touchend="onDrawEnd"
      @touchleave="onDrawEnd"
      @touchcancel="onDrawEnd"
      @pointerdown="onDrawStart"
      @pointermove="onDraw"
      @pointerup="onDrawEnd"
      @pointerleave="onDrawEnd"
      @pointercancel="onDrawEnd"
    />
    <div v-if="enabled" class="toolbox">
      <ski-button variant="light" @click="toggleEraser">
        <ski-icon :icon="tool === 'pen' ? 'eraser-fill' : 'pencil-fill'" /> {{ tool === 'pen' ? 'Gomme' : 'Crayon' }}
      </ski-button>
      <ski-button variant="light" @click="pickColor">
        <input ref="drawColor" v-model="drawColor" type="color" hidden>
        <ski-icon icon="palette-fill" />
        Couleur
      </ski-button>
      <ski-button variant="light" @click="clearCanvas">
        <ski-icon icon="trash-fill" />
        Effacer
      </ski-button>
    </div>
  </div>
</template>

<script>
import { SkiButton, SkiIcon } from 'skimple-components'

export default {
  components: { SkiIcon, SkiButton },
  props: {
    enabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tool: 'pen',
      isDrawing: false,
      canvasContext: null,
      drawColor: '#e91e63'
    }
  },
  async mounted () {
    await this.$nextTick()
    window.addEventListener('resize', this.resizeCanvas, false)
    this.resizeCanvas()
  },
  unmounted () {
    window.removeEventListener('resize', this.resizeCanvas, false)
  },
  methods: {
    toggleEraser () {
      this.tool = this.tool === 'pen' ? 'eraser' : 'pen'
    },
    pickColor () {
      this.$refs.drawColor.click()
    },
    clearCanvas () {
      this.$refs.canvas.getContext('2d').clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
    },
    resizeCanvas () {
      this.$refs.canvas.width = this.$refs.parent.offsetWidth
      this.$refs.canvas.height = this.$refs.parent.offsetHeight
    },
    onDrawStart (event) {
      if (this.enabled && !this.isDrawing) {
        this.isDrawing = true
        this.canvasContext = this.$refs.canvas.getContext('2d')
        this.canvasContext.strokeStyle = this.drawColor
        this.canvasContext.lineWidth = 5
        this.canvasContext.lineJoin = 'round'
        this.canvasContext.lineCap = 'round'
        if (this.tool === 'eraser') {
          this.canvasContext.globalCompositeOperation = 'destination-out'
        }

        const coordinates = this.getCoordinates(event)
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(coordinates.x, coordinates.y)
      }
    },
    onDraw (event) {
      if (this.isDrawing) {
        const coordinates = this.getCoordinates(event)
        this.canvasContext.lineTo(coordinates.x, coordinates.y)
        this.canvasContext.stroke()
      }
    },
    onDrawEnd () {
      if (this.isDrawing) {
        this.canvasContext.closePath()
        this.canvasContext = null
        this.isDrawing = false
      }
    },
    getCoordinates (event) {
      let x, y
      if (event.touches && event.touches.length > 0) {
        const rect = this.$refs.canvas.getBoundingClientRect()
        x = event.touches[0].clientX - rect.left
        y = event.touches[0].clientY - rect.top
      } else {
        x = event.offsetX
        y = event.offsetY
      }
      return {
        x,
        y
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.parent {
  .canvas {
    border: 4px solid var(--bs-light);

    &.enabled {
      cursor: crosshair;
    }
  }

  .toolbox {
    text-align: right;
    margin-top: -8px;
  }
}
</style>
