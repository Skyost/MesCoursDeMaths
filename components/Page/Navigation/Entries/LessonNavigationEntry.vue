<template>
  <page-navigation-entry :title="lesson['page-title']" :to="`/cours/${level}/${lesson.slug}/`" :depth="2" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'LessonNavigationEntry',
  components: { PageNavigationEntry },
  props: {
    level: {
      type: String,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    }
  }
}
</script>
