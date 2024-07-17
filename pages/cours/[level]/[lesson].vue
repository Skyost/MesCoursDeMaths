<script lang="ts">
import { type Level, type LessonContent } from '~/types'
import { getLessonUrl } from '~/site/lessons'

export const lessonNavigationEntry = (lessonContent: LessonContent) => {
  return {
    title: lessonContent['page-title'],
    to: getLessonUrl(lessonContent),
    depth: 1
  }
}
</script>

<script setup lang="ts">
import { levelsNavigationEntry } from '~/pages/cours/index.vue'
import { levelNavigationEntry } from '~/pages/cours/[level]/index.vue'
import { getLevelUrl, levels } from '~/site/levels'
import { siteContentSettings } from '~/site/content'
import Control from '~/components/Controls/Control.vue'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { pending, data: lessonContent, error } = useLazyAsyncData(
  route.path,
  () => queryContent<LessonContent>(siteContentSettings.dataLatexDirectory, level?.id)
    .where({ id: route.params.lesson.toString() })
    .findOne()
)

const title = computed(() => level && lessonContent.value ? `${level.name} > ${lessonContent.value['page-title']}` : 'Affichage d\'un cours')

useNavigationEntry(levelsNavigationEntry)
if (level) {
  useNavigationEntry(levelNavigationEntry(level))
}
const onMathDocumentMounted = () => useNavigationEntry(lessonNavigationEntry(lessonContent.value!))
</script>

<template>
  <div>
    <page-head :title="title" />
    <div v-if="pending">
      <spinner />
    </div>
    <div v-else-if="level && lessonContent">
      <controls>
        <controls-section>
          <controls-section-title />
          <control
            :to="getLevelUrl(level)"
            text="Retourner à la liste des cours"
          />
          <control
            :href="lessonContent.pdf"
            text="Télécharger le PDF"
            icon-id="file-earmark-pdf-fill"
          />
        </controls-section>
        <controls-section v-if="lessonContent['linked-resources'].length > 0">
          <controls-section-title
            icon-id="paperclip"
            title="Ressources associées"
          />
          <control
            v-for="resource in lessonContent['linked-resources']"
            :key="resource.url"
            :href="resource.url"
            :icon-id="resource.url.endsWith('.pdf') ? 'file-earmark-pdf-fill' : null"
            :text="resource.title"
          />
        </controls-section>
      </controls>
      <main>
        <math-document
          :title="lessonContent!.name"
          :color="level!.color"
          :body="lessonContent!.body"
          @vue:mounted="onMathDocumentMounted"
        />
      </main>
    </div>
    <div v-else>
      <error-display
        :change-title="true"
        :error="error ?? 404"
      />
    </div>
  </div>
</template>

<style lang="scss">
.lesson-control-buttons {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 1rem;

  .title {
    flex-basis: 100%;
    text-align: right;
    font-size: 0.8em;
    margin-bottom: 4px;
  }

  &:last-of-type {
    margin-bottom: 24px;
  }
}
</style>
