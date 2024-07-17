<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { debounce } from 'perfect-debounce'
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

const props = withDefaults(defineProps<{
  defaultX?: number
  defaultY?: number
  data: string
}>(), {
  defaultX: 10,
  defaultY: 10
})

const emit = defineEmits<{ (event: 'closed'): void }>()

const { pdf, pages } = usePDF(props.data)
const page = ref<number>(1)
const vuePdfComponent = ref<typeof VuePDF | null>(null)
const refreshPdf = debounce(() => vuePdfComponent.value?.reload(), 50)
</script>

<template>
  <draggable
    class="draggable-pdf"
    title="Document PDF"
    :default-x="defaultX"
    :default-y="defaultY"
    @closed="emit('closed')"
    @resized="refreshPdf"
  >
    <b-row>
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
    <div class="m-auto">
      <vue-p-d-f
        ref="vuePdfComponent"
        :pdf="pdf"
        :page="page"
        fit-parent
      />
    </div>
  </draggable>
</template>

<style lang="scss">
.draggable-pdf .card-body {
  padding: 0;
}
</style>
