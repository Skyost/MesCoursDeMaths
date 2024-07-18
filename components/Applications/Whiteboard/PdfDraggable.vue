<script setup lang="ts">
import { debounce } from 'perfect-debounce'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { ComponentPublicInstance } from 'vue'
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  defaultX?: number
  defaultY?: number
  data: string
}>(), {
  defaultX: 10,
  defaultY: 10
})

const buttonsComponent = ref<ComponentPublicInstance | null>(null)
const pdfContainerElement = ref<HTMLDivElement | null>(null)

const height = ref<number>(100)
const page = ref<number>(1)
const pages = ref<number>(1)

const emit = defineEmits<{ (event: 'closed'): void }>()

const updatedPdfSize = debounce(() => height.value = Math.max(100, pdfContainerElement.value!.offsetHeight - buttonsComponent.value!.$el.offsetHeight), 50)
</script>

<template>
  <draggable
    class="draggable-pdf"
    title="Document PDF"
    :default-x="defaultX"
    :default-y="defaultY"
    @closed="emit('closed')"
    @resized="updatedPdfSize"
  >
    <b-row ref="buttonsComponent">
      <b-col
        cols="3"
        class="pe-0"
      >
        <b-button
          class="w-100"
          :disabled="page <= 1"
          @click="page--"
        >
          <icon name="bi:arrow-left" />
        </b-button>
      </b-col>
      <b-col
        cols="6"
        class="p-0"
      >
        <b-button
          class="w-100"
          variant="light"
          disabled
        >
          {{ page }} / {{ pages }}
        </b-button>
      </b-col>
      <b-col
        cols="3"
        class="ps-0"
      >
        <b-button
          class="w-100"
          :disabled="page >= pages"
          @click="page++"
        >
          <icon name="bi:arrow-right" />
        </b-button>
      </b-col>
    </b-row>
    <div
      ref="pdfContainerElement"
      class="pdf-container"
    >
      <vue-pdf-embed
        ref="vuePdfComponent"
        :source="data"
        :page="page"
        :height="height"
        @loaded="(document: PDFDocumentProxy) => pages = document.numPages"
      />
    </div>
  </draggable>
</template>

<style lang="scss" scoped>
@import 'vue-pdf-embed/dist/style/index.css';

.draggable-pdf :deep(.card-body) {
  padding: 0;
}

.pdf-container {
  height: 100%;
  min-height: 200px;

  :deep(canvas) {
    display: block;
    margin: auto;
  }
}
</style>
