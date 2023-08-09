<script setup lang="ts">
import { blobAsDataUrl } from '~/utils/utils'

export interface FileContent {
  file: File,
  content: string
}

defineProps<{
  accept?: string,
  icon: string,
  text: string
}>()
const emit = defineEmits<{(event: 'loaded', file: FileContent): void}>()

const fileInput = ref<HTMLInputElement | null>(null)

const promptForFile = () => {
  fileInput.value!.onchange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files: FileList | null = target.files
    if (files && files.length > 0) {
      const content = await blobAsDataUrl(files[0])
      emit('loaded', { file: files[0], content })
    }
  }
  fileInput.value!.click()
}
</script>

<template>
  <span>
    <input ref="fileInput" type="file" :accept="accept" hidden>
    <ski-button variant="light" @click="promptForFile">
      <ski-icon :icon="icon" /> {{ text }}
    </ski-button>
  </span>
</template>
