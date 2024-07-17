<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { FileContent } from '~/components/Applications/FileUploadButton.vue'
import FileUploadButton from '~/components/Applications/FileUploadButton.vue'
import WhiteboardCanvas from '~/components/Applications/Whiteboard/WhiteboardCanvas.vue'
import TextDraggable from '~/components/Applications/Whiteboard/TextDraggable.vue'
import PdfDraggable from '~/components/Applications/Whiteboard/PdfDraggable.vue'
import ImageDraggable from '~/components/Applications/Whiteboard/ImageDraggable.vue'
import StopwatchDraggable from '~/components/Applications/Whiteboard/StopwatchDraggable.vue'
import ClockDraggable from '~/components/Applications/Whiteboard/ClockDraggable.vue'
import BackToApplications from '~/components/Applications/BackToApplications.vue'
import Controls from '~/components/Controls/Controls.vue'
import Control from '~/components/Controls/Control.vue'

interface UniqueFileContent {
  content: string
  uniqueHash: number
}

const root = ref<HTMLDivElement | null>(null)
const tools = ref<ComponentPublicInstance | null>(null)

const texts = ref<number[]>([])
const stopwatches = ref<number[]>([])
const clocks = ref<number[]>([])
const pdfs = ref<UniqueFileContent[]>([])
const images = ref<UniqueFileContent[]>([])

const isDrawing = ref<boolean>(false)
const isFullscreen = ref<boolean>(false)
const useRandomBackground = ref<boolean>(false)

const canvasHeight = ref<number | undefined>()

const toggleFullscreen = async () => {
  if (isFullscreen.value) {
    await document.exitFullscreen()
  }
  else {
    await root.value?.requestFullscreen()
  }
}

const onFullscreenChange = () => isFullscreen.value = !isFullscreen.value

const addDraggable = (draggable: 'clock' | 'stopwatch' | 'text') => {
  switch (draggable) {
    case 'text':
      texts.value.push(createUniqueHash())
      break
    case 'stopwatch':
      stopwatches.value.push(createUniqueHash())
      break
    case 'clock':
      clocks.value.push(createUniqueHash())
      break
    default:
      break
  }
}

const onPdfLoaded = (data: FileContent) => pdfs.value.push({
  content: data.content,
  uniqueHash: createUniqueHash()
})

const onImageLoaded = (data: FileContent) => images.value.push({
  content: data.content,
  uniqueHash: createUniqueHash()
})

const removeDraggable = (draggable: 'clock' | 'image' | 'pdf' | 'stopwatch' | 'text', index: number) => {
  switch (draggable) {
    case 'text':
      texts.value.splice(index, 1)
      break
    case 'pdf':
      pdfs.value.splice(index, 1)
      break
    case 'image':
      images.value.splice(index, 1)
      break
    case 'stopwatch':
      stopwatches.value.splice(index, 1)
      break
    case 'clock':
      clocks.value.splice(index, 1)
      break
    default:
      break
  }
}

const createUniqueHash = () => new Date().getTime()

const updateCanvasHeight = () => {
  if (import.meta.client && window && tools.value) {
    canvasHeight.value = Math.max(100, window.innerHeight - tools.value!.$el.offsetHeight - 70)
  }
}

const getDefaultX = (draggable: 'clock' | 'image' | 'pdf' | 'stopwatch' | 'text', index: number) => {
  switch (draggable) {
    case 'pdf':
      return 100 + 10 * index
    case 'image':
      return 200 + 10 * index
    case 'stopwatch':
      return 300 + 10 * index
    case 'clock':
      return 400 + 10 * index
    case 'text':
    default:
      return 10 * index
  }
}
const getDefaultY = (index: number) => {
  return tools.value!.$el.offsetHeight + 24 + 10 * index
}

if (import.meta.client) {
  const resizeObserver = new ResizeObserver(updateCanvasHeight)
  onMounted(() => {
    resizeObserver.observe(tools.value!.$el)
    window.addEventListener('resize', updateCanvasHeight, false)
  })
  onBeforeUnmount(() => {
    resizeObserver.unobserve(tools.value!.$el)
    window.removeEventListener('resize', updateCanvasHeight, false)
  })
}
</script>

<template>
  <div
    ref="root"
    class="position-relative"
    :class="{ 'bg-white': isFullscreen, 'p-4': isFullscreen }"
    @fullscreenchange="onFullscreenChange"
  >
    <controls ref="tools">
      <controls-section v-if="!isFullscreen">
        <controls-section-title />
        <back-to-applications />
      </controls-section>
      <controls-section>
        <controls-section-title
          title="Canevas"
          icon-id="easel2"
        />
        <control
          icon-id="camera-fill"
          text="Fond aléatoire"
          :active="useRandomBackground"
          @click="useRandomBackground = !useRandomBackground"
        />
        <control
          icon-id="fullscreen"
          text="Plein écran"
          :active="isFullscreen"
          @click="toggleFullscreen"
        />
      </controls-section>
      <controls-section>
        <controls-section-title
          title="Outils"
          icon-id="gear"
        />
        <control
          :class="{ active: isDrawing }"
          :icon-id="isDrawing ? 'pencil-fill' : 'pencil'"
          text="Crayon"
          @click="isDrawing = !isDrawing"
        />
        <control
          icon-id="card-text"
          text="Texte"
          @click="addDraggable('text')"
        />
        <file-upload-button
          icon-id="file-pdf-fill"
          text="Document PDF"
          accept="application/pdf"
          @loaded="onPdfLoaded"
        />
        <file-upload-button
          icon-id="card-image"
          text="Image"
          accept="image/*"
          @loaded="onImageLoaded"
        />
        <control
          icon-id="stopwatch"
          text="Chronomètre"
          @click="addDraggable('stopwatch')"
        />
        <control
          icon-id="clock"
          text="Horloge"
          @click="addDraggable('clock')"
        />
      </controls-section>
    </controls>
    <whiteboard-canvas
      class="whiteboard-canvas"
      :writing="isDrawing"
      :use-random-background="useRandomBackground"
      :canvas-height="canvasHeight"
    />
    <text-draggable
      v-for="(hash, index) in texts"
      :key="`text-${hash}`"
      :default-x="getDefaultX('text', index)"
      :default-y="getDefaultY(index)"
      @closed="removeDraggable('text', index)"
    />
    <pdf-draggable
      v-for="(data, index) in pdfs"
      :key="`pdf-${data.uniqueHash}`"
      :data="data.content"
      :default-x="getDefaultX('pdf', index)"
      :default-y="getDefaultY(index)"
      @closed="removeDraggable('pdf', index)"
    />
    <image-draggable
      v-for="(data, index) in images"
      :key="`image-${data.uniqueHash}`"
      :data="data.content"
      :default-x="getDefaultX('image', index)"
      :default-y="getDefaultY(index)"
      @closed="removeDraggable('image', index)"
    />
    <stopwatch-draggable
      v-for="(hash, index) in stopwatches"
      :key="`stopwatch-${hash}`"
      :default-x="getDefaultX('stopwatch', index)"
      :default-y="getDefaultY(index)"
      @closed="removeDraggable('stopwatch', index)"
    />
    <clock-draggable
      v-for="(hash, index) in clocks"
      :key="`clock-${hash}`"
      :default-x="getDefaultX('clock', index)"
      :default-y="getDefaultY(index)"
      @closed="removeDraggable('clock', index)"
    />
  </div>
</template>

<style lang="scss" scoped>
.whiteboard-canvas {
  height: 100%;
  width: 100%;
  z-index: 0;
}
</style>
