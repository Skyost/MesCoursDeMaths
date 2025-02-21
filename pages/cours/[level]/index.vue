<script lang="ts">
import type { Level, Lesson, Resource } from '~/types'
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
// eslint-disable-next-line import/order
import { type IconifyIcon, loadIcon } from '@iconify/vue'
import Control from '~/components/Controls/Control.vue'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { data: lessons, status, error } = await useFetch<Lesson[]>(`/_api/latex/${level?.id}/index.json`)

const title = computed<string>(() => level ? `Cours de ${level.name}` : 'Liste des cours')

useNavigationEntry(levelsNavigationEntry)
if (level) {
  useNavigationEntry(levelNavigationEntry(level))
}

const pdfIcon = await loadIcon('bi:file-earmark-pdf-fill')
const textIcon = await loadIcon('bi:file-earmark-text-fill')

const sortedLessons = computed<Lesson[] | undefined>(() => lessons.value?.slice().sort((a, b) => a.number - b.number))
const otherResourcesModal = ref<boolean>(false)
const getOtherResourceIcon = (otherResource: Resource) => {
  const iconToHtml = (icon: IconifyIcon) => `<svg height="${icon.height}" width="${icon.width}" viewBox="0 0 ${icon.width} ${icon.height}" aria-hidden="true">${icon.body}</svg>`
  if (otherResource.url.endsWith('.pdf')) {
    return iconToHtml(pdfIcon)
  }
  return iconToHtml(textIcon)
}
const getOtherResourceIconColor = (otherResource: Resource) => {
  if (otherResource.url.endsWith('.pdf')) {
    return 'danger'
  }
  return null
}
</script>

<template>
  <div>
    <page-head :title="title" />
    <div v-if="status === 'pending'">
      <spinner />
    </div>
    <div v-else-if="level && sortedLessons">
      <controls>
        <controls-section>
          <control
            to="/cours/"
            text="Retourner à la liste des niveaux"
          />
          <control
            v-if="level.otherResources && level.otherResources.length > 0"
            text="Autres ressources"
            icon-id="file-earmark-text-fill"
            @click="otherResourcesModal = !otherResourcesModal"
          />
        </controls-section>
      </controls>
      <h1 v-text="title" />
      <b-row class="justify-content-center">
        <b-col
          v-for="lesson in sortedLessons"
          :key="lesson.id"
          xs="12"
          md="6"
          lg="4"
          class="mt-3"
        >
          <image-card
            :title="lesson.name"
            :color="level.color"
            :subtitle="getLessonSubtitle(lesson as Lesson)"
            :to="getLessonUrl(lesson as Lesson)"
            :image="getLessonImage(lesson as Lesson)"
          />
        </b-col>
      </b-row>
      <b-modal
        v-if="level.otherResources && level.otherResources.length > 0"
        v-model="otherResourcesModal"
        title="Autres ressources"
        size="lg"
        ok-only
        ok-title="Fermer"
        ok-variant="secondary"
      >
        <p>
          Ce niveau comporte d'autres ressources qui ne sont pas associées à un chapitre particulier.
        </p>
        <b-list-group class="mb-3">
          <b-list-group-item
            v-for="otherResource in level.otherResources"
            :key="otherResource.url"
            :href="otherResource.url"
          >
            <span class="d-flex align-items-center gap-3">
              <span
                class="fs-2 resource-icon"
                :class="{ [`text-${getOtherResourceIconColor(otherResource)}`]: getOtherResourceIconColor(otherResource) }"
                v-html="getOtherResourceIcon(otherResource)"
              />
              <span>
                <strong class="d-block">{{ otherResource.name }}</strong>
                <small>{{ otherResource.description }}</small>
              </span>
            </span>
          </b-list-group-item>
        </b-list-group>
      </b-modal>
    </div>
    <div v-else>
      <error-display
        :change-title="true"
        :error="error ?? 404"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resource-icon > :deep(*) {
  height: 1em;
  min-width: 1em;
}
</style>
