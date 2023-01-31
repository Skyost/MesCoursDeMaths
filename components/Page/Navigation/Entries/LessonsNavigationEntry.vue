<template>
  <page-navigation-entry :title="title" :to="`/cours/${level}/`" :depth="1" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'
import levels from '~/site/levels'

export default {
  components: { PageNavigationEntry },
  props: {
    level: {
      type: String,
      required: true
    }
  },
  computed: {
    title () {
      return levels[this.level].name
    }
  }
}
</script>
