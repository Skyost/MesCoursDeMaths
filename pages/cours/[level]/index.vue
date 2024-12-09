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
import { siteContentSettings } from '~/site/content'
import Control from '~/components/Controls/Control.vue'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { status, data: lessons, error } = useLazyAsyncData(
  route.path,
  () => queryContent<Lesson>(siteContentSettings.dataLatexDirectory, level?.id)
    .without('body')
    .sort({ number: 1, $numeric: true })
    .find()
)

const title = computed<string>(() => level ? `Cours de ${level.name}` : 'Liste des cours')

useNavigationEntry(levelsNavigationEntry)
if (level) {
  useNavigationEntry(levelNavigationEntry(level))
}

const otherResourcesModal = ref<boolean>(false)
const getOtherResourceIcon = (otherResource: Resource) => {
  if (otherResource.url.endsWith('.pdf')) {
    return 'bi:file-earmark-pdf-fill'
  }
  return 'bi:file-earmark-text-fill'
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
    <div v-else-if="level && lessons">
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
            <div class="d-flex align-items-center gap-3">
              <div
                class="fs-2"
                :class="{ [`text-${getOtherResourceIconColor(otherResource)}`]: getOtherResourceIconColor(otherResource) }"
              >
                <icon :name="getOtherResourceIcon(otherResource)" />
              </div>
              <div>
                <strong
                  class="d-block"
                  v-html="otherResource.name"
                />
                <small v-html="otherResource.description" />
              </div>
            </div>
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
