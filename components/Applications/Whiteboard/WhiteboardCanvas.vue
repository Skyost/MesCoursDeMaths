<script lang="ts" setup>
const props = withDefaults(defineProps<{ enabled?: boolean }>(), { enabled: false })

const tool = ref<'pen' | 'eraser'>('pen')
const isDrawing = ref<boolean>(false)
const canvasContext = ref<CanvasRenderingContext2D | null>(null)
const drawColor = ref<string>('#e91e63')
const drawColorInput = ref<HTMLInputElement | null>(null)
const parent = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const toggleEraser = () => {
  tool.value = tool.value === 'pen' ? 'eraser' : 'pen'
}

const clearCanvas = () => {
  canvas.value!.getContext('2d')?.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
}

const resizeCanvas = () => {
  canvas.value!.width = parent.value!.offsetWidth
  canvas.value!.height = parent.value!.offsetHeight
}

const onDrawStart = (event: MouseEvent | TouchEvent) => {
  if (props.enabled && !isDrawing.value) {
    isDrawing.value = true
    canvasContext.value = canvas.value!.getContext('2d')
    canvasContext.value!.strokeStyle = drawColor.value
    canvasContext.value!.lineWidth = 5
    canvasContext.value!.lineJoin = 'round'
    canvasContext.value!.lineCap = 'round'
    canvasContext.value!.globalCompositeOperation = tool.value === 'eraser' ? 'destination-out' : 'color'

    const coordinates = getCoordinates(event)
    canvasContext.value!.beginPath()
    canvasContext.value!.moveTo(coordinates.x, coordinates.y)
  }
}

const onDraw = (event: MouseEvent | TouchEvent) => {
  if (isDrawing.value) {
    const coordinates = getCoordinates(event)
    canvasContext.value!.lineTo(coordinates.x, coordinates.y)
    canvasContext.value!.stroke()
  }
}

const onDrawEnd = () => {
  if (isDrawing.value) {
    canvasContext.value!.closePath()
    canvasContext.value = null
    isDrawing.value = false
  }
}

const getCoordinates = (event: MouseEvent | TouchEvent) => {
  let x = 0
  let y = 0
  if (event instanceof TouchEvent) {
    if (event.touches && event.touches.length > 0) {
      const rect = canvas.value!.getBoundingClientRect()
      x = event.touches[0].clientX - rect.left
      y = event.touches[0].clientY - rect.top
    }
  } else {
    x = event.offsetX
    y = event.offsetY
  }
  return {
    x,
    y
  }
}

const changeColor = () => drawColorInput.value?.click()

onMounted(async () => {
  await nextTick()
  window.addEventListener('resize', resizeCanvas, false)
  resizeCanvas()
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas, false)
})
</script>

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
      <ski-button variant="light" @click="changeColor">
        <input ref="drawColorInput" v-model="drawColor" type="color" hidden>
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
