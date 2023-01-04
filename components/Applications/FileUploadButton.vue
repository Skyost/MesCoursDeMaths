<template>
  <span>
    <input ref="fileInput" type="file" :accept="accept" hidden>
    <ski-button variant="light" @click="promptForFile">
      <ski-icon :icon="icon" /> {{ text }}
    </ski-button>
  </span>
</template>

<script>
import { SkiButton, SkiIcon } from 'skimple-components'

export default {
  components: { SkiButton, SkiIcon },
  props: {
    accept: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  emits: ['fileloaded'],
  methods: {
    promptForFile () {
      this.$refs.fileInput.onchange = (event) => {
        const file = event.target.files[0]
        this.blobAsDataUrl(file).then(content => this.$emit('fileloaded', { file, content }))
      }
      this.$refs.fileInput.click()
    },
    blobAsDataUrl (blob) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function (event) {
          resolve(event.target.result)
        }
        reader.onerror = function (error) {
          reader.abort()
          reject(error)
        }
        reader.readAsDataURL(blob)
      })
    }
  }
}
</script>
