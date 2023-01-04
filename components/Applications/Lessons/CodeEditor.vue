<template>
  <codemirror v-model="document" class="code-editor" />
</template>

<script>
import { Codemirror } from 'vue-codemirror'

export default {
  components: { Codemirror },
  props: {
    sourceDocument: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      document: this.sourceDocument
    }
  }
}
</script>
