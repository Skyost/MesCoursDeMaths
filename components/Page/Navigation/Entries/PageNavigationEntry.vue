<template>
  <span v-if="false" />
</template>

<script>
export default {
  name: 'PageNavigationEntry',
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.$nuxt.$emit('navigation', {
      title: this.title,
      to: this.to
    })
  }
}
</script>
