<template>
  <div class="code-editor" v-text="sourceDocument" />
</template>

<script>
export default {
  name: 'CodeEditor',
  props: {
    sourceDocument: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: 'latex'
    },
    theme: {
      type: String,
      default: 'dracula'
    }
  },
  data () {
    return {
      editor: null,
      document: this.sourceDocument
    }
  },
  async mounted () {
    const Ace = await import('ace-builds')
    await import(`ace-builds/src-min-noconflict/mode-${this.mode}`)
    await import(`ace-builds/src-min-noconflict/theme-${this.theme}`)
    // Ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
    this.editor = Ace.edit(this.$el, {
      mode: `ace/mode/${this.mode}`,
      theme: `ace/theme/${this.theme}`,
      fontSize: 14
    })
    this.editor.session.on('change', () => {
      this.document = this.editor.getValue()
    })
  }
}
</script>
