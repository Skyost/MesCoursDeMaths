<template>
  <img :src="src" :alt="alt" :width="width" :height="height">
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: undefined
    },
    height: {
      type: [String, Number],
      default: undefined
    }
  },
  async mounted () {
    await this.$nextTick()
    if (this.$el.classList.contains('extracted-image')) {
      this.$el.onload = () => {
        this.$el.width = this.$el.naturalWidth * 1.5
      }
    }
  }
}
</script>
