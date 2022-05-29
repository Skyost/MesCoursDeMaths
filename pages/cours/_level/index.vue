<template>
  <div v-if="$fetchState.pending">
    <spinner />
  </div>
  <div v-else-if="lessons">
    <social-head :title="title" />
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
    <error-display :error-code="404" />
  </div>
</template>

<script>
import { SkiColumns, SkiColumn, SkiButton, SkiIcon } from 'skimple-components'
import ImageCard from '~/components/ImageCard'
import level from '~/utils/level'

export default {
  components: { SkiColumns, SkiColumn, SkiButton, SkiIcon, ImageCard },
  data () {
    return {
      lessons: null
    }
  },
  async fetch () {
    const lessons = await this.$content(this.$route.params.level)
      .sortBy('number')
      .fetch()
    this.lessons = lessons.map((lesson) => {
      return {
        id: lesson.slug,
        title: lesson.name,
        subtitle: `Chapitre ${lesson.number}`,
        color: level.getLevelColor(this.$route.params.level),
        url: `/cours/${this.$route.params.level}/${lesson.slug}/`
      }
    })
  },
  head () {
    return {
      title: this.title
    }
  },
  computed: {
    title () {
      return `Liste des cours de ${this.levelName}`
    },
    levelName () {
      return level.getLevelName(this.$route.params.level)
    }
  }
}

</script>
