<template>
  <span v-if="navigationLinks.length > 0">
    <span v-for="(navigationLink, index) of navigationLinks" :key="navigationLink.to">
      <nuxt-link :to="navigationLink.to" v-text="navigationLink.title" /><ski-icon v-if="index < navigationLinks.length - 1" icon="chevron-right" />
    </span>
  </span>
</template>

<script>
import { SkiIcon } from 'skimple-components'

export default {
  name: 'PageNavigation',
  components: { SkiIcon },
  data () {
    return {
      navigationLinks: []
    }
  },
  watch: {
    '$route' () {
      this.navigationLinks = []
    }
  },
  mounted () {
    this.$nuxt.$on('navigation', data => this.navigationLinks.push(data))
  }
}
</script>
