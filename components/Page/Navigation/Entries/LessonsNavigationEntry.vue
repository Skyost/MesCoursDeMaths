<template>
  <page-navigation-entry :title="title" :to="`/cours/${level}/`" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'
import levelUtils from '~/utils/level'

export default {
  name: 'LessonsNavigationEntry',
  components: { PageNavigationEntry },
  props: {
    level: {
      type: String,
      required: true
    }
  },
  computed: {
    title () {
      return levelUtils.getLevelName(this.level)
    }
  }
}
</script>
