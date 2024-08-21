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
import Control from '~/components/Controls/Control.vue'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { pending, data: lessons, error } = useLazyAsyncData(
  route.path,
  () => queryContent<Lesson>(siteContentSettings.dataLatexDirectory, level?.id)
    .without('body')
    .sort({ number: 1, $numeric: true })
    .find()
)

const title = computed(() => level ? `Cours de ${level.name}` : 'Liste des cours')

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
      <controls>
        <controls-section>
          <control
            to="/cours/"
            text="Retourner à la liste des niveaux"
          />
        </controls-section>
      </controls>
      <h1 v-text="title" />
      <b-row class="justify-content-center">
        <b-col
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
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <error-display
        :change-title="true"
        :error="error ?? 404"
      />
    </div>
  </div>
</template>
