<script setup lang="ts">
import type { FileContent } from '~/components/Applications/FileUploadButton.vue';
import FileUploadButton from '~/components/Applications/FileUploadButton.vue'
import WhiteboardCanvas from '~/components/Applications/Whiteboard/WhiteboardCanvas.vue'
import TextDraggable from '~/components/Applications/Whiteboard/TextDraggable.vue'
import PdfDraggable from '~/components/Applications/Whiteboard/PdfDraggable.vue'
import ImageDraggable from '~/components/Applications/Whiteboard/ImageDraggable.vue'
import StopwatchDraggable from '~/components/Applications/Whiteboard/StopwatchDraggable.vue'

const textCount = ref<number>(0)
const stopwatchCount = ref<number>(0)
const pdfsData = ref<string[]>([])
const imagesData = ref<string[]>([])
const isDrawing = ref<boolean>(false)

const onPdfLoaded = (data: FileContent) => pdfsData.value.push(data.content)
const onImageLoaded = (data: FileContent) => imagesData.value.push(data.content)
</script>

<template>
  <div>
    <div class="text-end">
      <ski-button variant="light" :class="{active: isDrawing}" @click="isDrawing = !isDrawing">
        <ski-icon :icon="isDrawing ? 'pencil-fill' : 'pencil'" /> Crayon
      </ski-button>
      <ski-button variant="light" @click="textCount += 1">
        <ski-icon icon="card-text" /> Texte
      </ski-button>
      <file-upload-button icon="file-pdf-fill" text="Document PDF" accept="application/pdf" @loaded="onPdfLoaded" />
      <file-upload-button icon="card-image" text="Image" accept="image/*" @loaded="onImageLoaded" />
      <ski-button variant="light" @click="stopwatchCount += 1">
        <ski-icon icon="stopwatch-fill" /> Chronomètre
      </ski-button>
    </div>
    <whiteboard-canvas class="whiteboard-canvas" :enabled="isDrawing" />
    <input ref="fileInput" type="file" hidden>
    <text-draggable
      v-for="i in textCount"
      :key="`text-${i}`"
      :index="i"
    />
    <pdf-draggable
      v-for="(data, index) in pdfsData"
      :key="`pdf-${index}`"
      :index="index"
      :data="data"
      @closed="pdfsData = pdfsData.filter(item => item !== data)"
    />
    <image-draggable
      v-for="(data, index) in imagesData"
      :key="`image-${index}`"
      :index="index"
      :data="data"
      @closed="imagesData = imagesData.filter(item => item !== data)"
    />
    <stopwatch-draggable
      v-for="i in stopwatchCount"
      :key="`stopwatch-${i}`"
      :index="i"
    />
  </div>
</template>

<style lang="scss" scoped>
.whiteboard-canvas {
  height: 100%;
  width: 100%;
  z-index: 0;
  min-height: 500px;
}
</style>
