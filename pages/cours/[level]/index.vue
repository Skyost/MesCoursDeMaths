<script lang="ts">
import { Level, Lesson, createLesson } from '~/types'

export const levelNavigationEntry = (level: Level) => {
  return {
    title: level.name,
    to: level.url,
    depth: 1
  }
}
</script>

<script setup lang="ts">
import { levels } from '~/site/levels'
import { levelsNavigationEntry } from '~/pages/cours/index.vue'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { pending, data: lessons, error } = useLazyAsyncData(
  route.path,
  async () => {
    const mdLessons = await queryContent(level.id)
      .only(['_extension', 'number', 'slug', 'name'])
      .sort({ number: 1, $numeric: true })
      .where({ _extension: 'md' })
      .find()
    const lessons: Lesson[] = []
    for (const mdLesson of mdLessons) {
      lessons.push(createLesson(mdLesson.slug, mdLesson.name, mdLesson.number, level))
    }
    return lessons
  }
)

const title = computed(() => level ? `Cours de ${level.name.toLowerCase()}` : 'Liste des cours')

useHead({ title })

useNavigationEntry(levelsNavigationEntry)
if (level) {
  useNavigationEntry(levelNavigationEntry(level))
}
</script>

<template>
  <div v-if="pending">
    <spinner />
  </div>
  <div v-else-if="lessons">
    <page-head :title="title" />
    <div class="text-end mb-3">
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
          :title="lesson.name"
          :color="lesson.color"
          :subtitle="lesson.subtitle"
          :to="lesson.url"
        />
      </ski-column>
    </ski-columns>
  </div>
  <div v-else>
    <error-display :error="error || 404" />
  </div>
</template>
