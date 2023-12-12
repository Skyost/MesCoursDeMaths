<script lang="ts">
import type { Level, Lesson } from '~/types'
import { getLevelUrl, levels } from '~/site/levels'

export const levelNavigationEntry = (level: Level) => {
  return {
    title: level.name,
    to: getLevelUrl(level),
    depth: 1
  }
}
</script>

<script setup lang="ts">
import { levelsNavigationEntry } from '~/pages/cours/index.vue'
import { getLessonImage, getLessonSubtitle, getLessonUrl } from '~/site/lessons'
import { siteContentSettings } from '~/site/content'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { pending, data: lessons, error } = useLazyAsyncData(
  route.path,
  () => queryContent<Lesson>(siteContentSettings.dataLatexDirectory, level?.id)
    .without('body')
    .sort({ number: 1, $numeric: true })
    .find()
)

const title = computed(() => level ? `Cours de ${level.name.toLowerCase()}` : 'Liste des cours')

useNavigationEntry(levelsNavigationEntry)
if (level) {
  useNavigationEntry(levelNavigationEntry(level))
}
</script>

<template>
  <div>
    <page-head :title="title" />
    <div v-if="pending">
      <spinner />
    </div>
    <div v-else-if="level && lessons">
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
            :color="level.color"
            :subtitle="getLessonSubtitle(lesson)"
            :to="getLessonUrl(lesson)"
            :image="getLessonImage(lesson)"
          />
        </ski-column>
      </ski-columns>
    </div>
    <div v-else>
      <error-display :change-title="true" :error="error ?? 404" />
    </div>
  </div>
</template>
