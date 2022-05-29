<template>
  <protected>
    <div class="text-end">
      <ski-button variant="light" :class="{active: isDrawing}" @click.native="isDrawing = !isDrawing">
        <ski-icon :icon="isDrawing ? 'pencil-fill' : 'pencil'" /> Crayon
      </ski-button>
      <ski-button variant="light" @click.native="textCount += 1">
        <ski-icon icon="card-text" /> Texte
      </ski-button>
      <file-upload-button icon="file-pdf-fill" text="Document PDF" accept="application/pdf" @fileloaded="onPDFLoaded" />
      <file-upload-button icon="card-image" text="Image" accept="image/*" @fileloaded="onImageLoaded" />
      <ski-button variant="light" @click.native="stopwatchCount += 1">
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
      @close="pdfsData.splice(index, 1)"
    />
    <image-draggable
      v-for="(data, index) in imagesData"
      :key="`image-${index}`"
      :index="index"
      :data="data"
      @close="imagesData.splice(index, 1)"
    />
    <stopwatch-draggable
      v-for="i in stopwatchCount"
      :key="`stopwatch-${i}`"
      :index="i"
    />
  </protected>
</template>

<script>
import { SkiButton, SkiIcon } from 'skimple-components'
import TextDraggable from '~/components/Applications/Whiteboard/TextDraggable'
import PdfDraggable from '~/components/Applications/Whiteboard/PdfDraggable'
import ImageDraggable from '~/components/Applications/Whiteboard/ImageDraggable'
import WhiteboardCanvas from '~/components/Applications/Whiteboard/WhiteboardCanvas'
import StopwatchDraggable from '~/components/Applications/Whiteboard/StopwatchDraggable'
import Protected from '~/components/Applications/Protected'
import FileUploadButton from '~/components/Applications/FileUploadButton'

export default {
  components: { FileUploadButton, SkiButton, SkiIcon, Protected, StopwatchDraggable, WhiteboardCanvas, TextDraggable, PdfDraggable, ImageDraggable },
  data () {
    return {
      textCount: 0,
      stopwatchCount: 0,
      pdfsData: [],
      imagesData: [],
      isDrawing: false
    }
  },
  head: {
    title: 'Tableau blanc'
  },
  mounted () {
    this.$emit('removespace')
  },
  methods: {
    onPDFLoaded (data) {
      this.pdfsData.push(data.content)
    },
    onImageLoaded (data) {
      this.imagesData.push(data.content)
    }
  }
}
</script>

<style lang="scss" scoped>
.whiteboard-canvas {
  height: 100%;
  width: 100%;
  z-index: 0;
  min-height: 500px;
}
</style>
