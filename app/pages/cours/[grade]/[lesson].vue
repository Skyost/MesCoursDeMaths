<script lang="ts">
import type { Grade, Lesson, LessonContent } from '~/types'
import { getLessonUrl, getGradeUrl } from '~/site/lessons'

export const lessonNavigationEntry = (grade: Grade, lesson: Lesson) => {
  return {
    title: lesson.pageTitle,
    to: getLessonUrl(grade, lesson),
    depth: 1
  }
}
</script>

<script setup lang="ts">
import { gradesNavigationEntry } from '~/pages/cours/index.vue'
import { gradeNavigationEntry } from '~/pages/cours/[grade]/index.vue'
import Control from '~/components/Controls/Control.vue'

const route = useRoute()

const { data: grade, status: gradeStatus, error: gradeError } = await useFetch<Grade>(`/_api/latex/${route.params.grade}/`)
const { data: lessonContent, status: lessonStatus, error: lessonError } = await useFetch<LessonContent>(`/_api/latex/${route.params.grade}/${route.params.lesson}/`)

useNavigationEntry(gradesNavigationEntry)
const onMathDocumentMounted = () => {
  useNavigationEntry(gradeNavigationEntry(grade.value))
  useNavigationEntry(lessonNavigationEntry(grade.value, lessonContent.value))
}

const title = computed(() => grade.value && lessonContent.value ? `${grade.value.name} > ${lessonContent.value.pageTitle}` : 'Affichage d\'un cours')
usePageHead({ title })
</script>

<template>
  <div>
    <div v-if="gradeStatus === 'pending' || lessonStatus === 'pending'">
      <spinner />
    </div>
    <div v-else-if="grade && lessonContent">
      <controls>
        <controls-section>
          <controls-section-title />
          <control
            :to="getGradeUrl(grade)"
            text="Retourner à la liste des cours"
          />
          <control
            :href="lessonContent.pdf"
            text="Télécharger le PDF"
            icon-id="file-earmark-pdf-fill"
          />
        </controls-section>
        <controls-section v-if="lessonContent.linkedResources.length > 0">
          <controls-section-title
            icon-id="paperclip"
            title="Ressources associées"
          />
          <control
            v-for="resource in lessonContent.linkedResources"
            :key="resource.url"
            :href="resource.url"
            :icon-id="resource.url.endsWith('.pdf') ? 'file-earmark-pdf-fill' : 'file-earmark-text-fill'"
            :text="resource.title"
          />
        </controls-section>
      </controls>
      <main>
        <math-document
          :title="lessonContent.name"
          :color="grade.color"
          :body="lessonContent.body"
          @vue:mounted="onMathDocumentMounted"
        />
      </main>
    </div>
    <div v-else>
      <error-display
        :change-title="true"
        :error="gradeError ?? lessonError ?? 404"
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
