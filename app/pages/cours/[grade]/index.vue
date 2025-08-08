<script lang="ts">
import type { Resource, Grade, GradeWithLessons } from '~/types'
import { getGradeRoute, getLessonRoute } from '~/site/lessons'

export const gradeNavigationEntry = (grade: Grade) => {
  return {
    title: grade.name,
    to: getGradeRoute(grade),
    depth: 1
  }
}
</script>

<script setup lang="ts">
import { gradesNavigationEntry } from '~/pages/cours/index.vue'
import { type IconifyIcon, loadIcon } from '@iconify/vue'
import Control from '~/components/Controls/Control.vue'

const route = useRoute()

const { data: grade, status, error } = await useFetch<GradeWithLessons>(`/_api/latex/${route.params.grade}/`)

useNavigationEntry(gradesNavigationEntry)

const loadBootstrapIconOrNull = async (name: string): Promise<IconifyIcon | null> => {
  try {
    return await loadIcon(`bi:${name}`)
  }
  catch (exception) {
    console.error(exception)
  }
  return null
}

const pdfIcon = await loadBootstrapIconOrNull('file-earmark-pdf-fill')
const textIcon = await loadBootstrapIconOrNull('file-earmark-text-fill')

const otherResourcesModal = ref<boolean>(false)
const getOtherResourceIcon = (otherResource: Resource) => {
  const iconToHtml = (icon: IconifyIcon) => `<svg height="${icon.height}" width="${icon.width}" viewBox="0 0 ${icon.width} ${icon.height}" aria-hidden="true">${icon.body}</svg>`
  if (otherResource.url.endsWith('.pdf')) {
    return pdfIcon ? iconToHtml(pdfIcon) : ''
  }
  return textIcon ? iconToHtml(textIcon) : ''
}
const getOtherResourceIconColor = (otherResource: Resource) => {
  if (otherResource.url.endsWith('.pdf')) {
    return 'danger'
  }
  return null
}

const onGradeControlsMounted = () => useNavigationEntry(gradeNavigationEntry(grade.value))

const title = computed<string>(() => grade.value ? `Cours de ${grade.value.name}` : 'Liste des cours')
usePageHead({ title })
</script>

<template>
  <div>
    <div v-if="status === 'pending'">
      <spinner />
    </div>
    <div v-else-if="grade">
      <controls @vue:mounted="onGradeControlsMounted">
        <controls-section>
          <control
            to="/cours/"
            text="Retourner à la liste des niveaux"
          />
          <control
            v-if="grade.otherResources && grade.otherResources.length > 0"
            text="Autres ressources"
            icon-id="file-earmark-text-fill"
            @click="otherResourcesModal = !otherResourcesModal"
          />
        </controls-section>
      </controls>
      <h1 v-text="title" />
      <b-row class="justify-content-center">
        <b-col
          v-for="lesson in grade.lessons"
          :key="lesson.id"
          xs="12"
          md="6"
          lg="4"
          class="mt-3"
        >
          <image-card
            :title="lesson.name"
            :color="grade.color"
            :subtitle="`Chapitre ${lesson.number}`"
            :to="getLessonRoute(grade, lesson)"
            :image="`/images/${grade.id}/${lesson.id}-cours/image.svg`"
          />
        </b-col>
      </b-row>
      <b-modal
        v-if="grade.otherResources && grade.otherResources.length > 0"
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
            v-for="otherResource in grade.otherResources"
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
