<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    writing?: boolean
    useRandomBackground?: boolean
    canvasHeight?: number
  }>(),
  {
    writing: false
  }
)

const borderSize = 4

const tool = ref<'pen' | 'eraser'>('pen')
const isDrawing = ref<boolean>(false)
const canvasContext = ref<CanvasRenderingContext2D | null>(null)
const drawColor = ref<string>('#e91e63')
const drawColorInput = ref<HTMLInputElement | null>(null)
const parent = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

let seed: number | null = null
let image: ImageData | null = null

const updateBackground = (useRandomBackground: boolean = props.useRandomBackground) => {
  if (useRandomBackground) {
    if (!seed) {
      seed = new Date().getTime()
    }
    const width = canvas.value!.offsetWidth
    const height = canvas.value!.offsetHeight
    canvas.value!.style.background = `url('https://picsum.photos/seed/${seed}/${width}/${height}')`
  }
  else {
    canvas.value!.style.background = 'white'
    seed = null
  }
}

watch(() => props.useRandomBackground, (useRandomBackground) => {
  updateBackground(useRandomBackground)
})

const toggleEraser = () => {
  tool.value = tool.value === 'pen' ? 'eraser' : 'pen'
}

const clearCanvas = () => {
  canvas.value!.getContext('2d')?.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
  image = null
}

const resizeCanvas = () => {
  canvas.value!.width = parent.value!.offsetWidth - (borderSize * 2)
  canvas.value!.height = (props.canvasHeight ?? parent.value!.offsetHeight) - (borderSize * 2)
  if (image) {
    const context = canvas.value!.getContext('2d')
    context?.putImageData(image, 0, 0)
  }
  updateBackground()
}

const onDrawStart = (event: MouseEvent | TouchEvent) => {
  if (props.writing && !isDrawing.value) {
    isDrawing.value = true
    canvasContext.value = canvas.value!.getContext('2d', { willReadFrequently: true })
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
    image = canvasContext.value!.getImageData(0, 0, canvas.value!.width, canvas.value!.height)
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
  }
  else {
    x = event.offsetX
    y = event.offsetY
  }
  return {
    x,
    y
  }
}

const changeColor = () => drawColorInput.value?.click()

if (import.meta.client) {
  const resizeObserver = new ResizeObserver(resizeCanvas)
  onMounted(async () => resizeObserver.observe(parent.value!))
  onBeforeUnmount(() => resizeObserver.unobserve(parent.value!))
}
</script>

<template>
  <div
    ref="parent"
    class="parent"
    :style="{ 'height': canvasHeight ? `${canvasHeight}px` : undefined, '--border-size': `${borderSize}px` }"
  >
    <canvas
      ref="canvas"
      class="canvas"
      :class="{ enabled: writing }"
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
    <div class="position-relative">
      <div
        v-if="writing"
        class="toolbox"
      >
        <b-button
          variant="light"
          @click="toggleEraser"
        >
          <icon :name="tool === 'pen' ? 'bi:eraser-fill' : 'bi:pencil-fill'" /> {{ tool === 'pen' ? 'Gomme' : 'Crayon' }}
        </b-button>
        <b-button
          variant="light"
          @click="changeColor"
        >
          <input
            ref="drawColorInput"
            v-model="drawColor"
            type="color"
            hidden
          >
          <icon name="bi:palette-fill" />
          Couleur
        </b-button>
        <b-button
          variant="light"
          @click="clearCanvas"
        >
          <icon name="bi:trash-fill" />
          Effacer
        </b-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parent {
  border: var(--border-size) solid var(--bs-light);

  .canvas.enabled {
    cursor: crosshair;
  }

  .toolbox {
    position: absolute;
    top: calc(-1 * var(--border-size));
    right: 0;
    transform: translateY(-100%);
  }
}
</style>
