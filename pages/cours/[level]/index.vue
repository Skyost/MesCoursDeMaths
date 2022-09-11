<script setup>
import { useLazyAsyncData, useRoute } from '#app'

const route = useRoute()
const { pending, data: lessons } = useLazyAsyncData(
  route.fullPath,
  async () => {
    const mdLessons = await queryContent(route.params.level)
      .sort({ number: 1 })
      .where({ _extension: 'md' })
      .find()
    const lessons = []
    for (const mdLesson of mdLessons) {
      lessons.push({
        id: mdLesson.slug,
        title: mdLesson.name,
        subtitle: `Chapitre ${mdLesson.number}`,
        color: levelUtils.getLevelColor(route.params.level),
        url: `/cours/${route.params.level}/${mdLesson.slug}/`
      })
    }
    return lessons
  }
)
</script>

<template>
  <div v-if="pending">
    <spinner />
  </div>
  <div v-else-if="lessons">
    <levels-navigation-entry />
    <lessons-navigation-entry :level="$route.params.level" />
    <page-head :title="title" />
    <div class="text-end">
      <ski-button variant="light" :to="`/cours/`">
        <ski-icon icon="arrow-left" /> Retourner à la liste des niveaux
      </ski-button>
    </div>
    <h1 v-text="title" />
    <ski-columns class="justify-content-center">
      <ski-column
        v-for="lesson in lessons"
        :key="lesson.id"
        xs="12"
        md="6"
        lg="4"
        class="mt-3"
      >
        <image-card
          :title="lesson.title"
          :color="lesson.color"
          :subtitle="lesson.subtitle"
          :to="lesson.url"
        />
      </ski-column>
    </ski-columns>
  </div>
  <div v-else>
    <error-display error="404" />
  </div>
</template>

<script>
import { SkiButton, SkiColumn, SkiColumns, SkiIcon } from 'skimple-components'
import Spinner from '~/components/Spinner.vue'
import ImageCard from '~/components/ImageCard'
import levelUtils from '~/utils/level'
import LevelsNavigationEntry from '~/components/Page/Navigation/Entries/LevelsNavigationEntry'
import LessonsNavigationEntry from '~/components/Page/Navigation/Entries/LessonsNavigationEntry'
import ErrorDisplay from '~/components/ErrorDisplay.vue'
import PageHead from '~/components/Page/PageHead'

export default {
  components: { PageHead, Spinner, LessonsNavigationEntry, ErrorDisplay, LevelsNavigationEntry, SkiColumns, SkiColumn, SkiButton, SkiIcon, ImageCard },
  computed: {
    title () {
      return `Liste des cours de ${this.levelName}`
    },
    levelName () {
      return levelUtils.getLevelName(this.$route.params.level)
    }
  }
}

</script>