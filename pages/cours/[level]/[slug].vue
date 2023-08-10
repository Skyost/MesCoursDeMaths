<script lang="ts">
import { Level, LessonContent, Lesson, createLesson } from '~/types'

interface LessonContentData {
  lesson: Lesson,
  content: LessonContent
}

export const lessonNavigationEntry = (lessonContentData: LessonContentData) => {
  return {
    title: lessonContentData.content['page-title'],
    to: lessonContentData.lesson.url,
    depth: 1
  }
}
</script>

<script setup lang="ts">
import { levels } from '~/site/levels'
import { levelsNavigationEntry } from '~/pages/cours/index.vue'
import { levelNavigationEntry } from '~/pages/cours/[level]/index.vue'

const route = useRoute()
const level: Level | undefined = levels[route.params.level.toString()]

const { pending, data, error } = useLazyAsyncData<LessonContentData>(
  route.path,
  async () => {
    const lessonContent: LessonContent = await queryContent<LessonContent>(level.id, route.params.slug.toString())
      .findOne()
    const result: LessonContentData = {
      lesson: createLesson(lessonContent.slug, lessonContent.name, lessonContent.number, level),
      content: lessonContent
    }
    return result
  }
)

const lesson = computed(() => data.value ? data.value.lesson : null)
const content = computed(() => data.value ? data.value.content : null)
const title = computed(() => level && content.value ? `${level.name} > ${content.value['page-title']}` : 'Affichage d\'un cours')

useHead({ title })

useNavigationEntry(levelsNavigationEntry)
if (level) {
  useNavigationEntry(levelNavigationEntry(level))
}
const onMathDocumentMounted = () => useNavigationEntry(lessonNavigationEntry(data.value!))
</script>

<template>
  <div v-if="pending">
    <spinner />
  </div>
  <div v-else-if="lesson && content">
    <page-head :title="title" />
    <div>
      <div class="lesson-control-buttons">
        <span class="title"><ski-icon icon="list" /> Navigation</span>
        <ski-button variant="light" :to="level.url">
          <ski-icon icon="arrow-left" /> Retourner à la liste des cours
        </ski-button>
        <ski-button variant="light" :href="lesson.pdf">
          <ski-icon icon="file-earmark-pdf-fill" /> Télécharger le PDF
        </ski-button>
      </div>
      <div v-if="content['linked-resources'].length > 0" class="lesson-control-buttons">
        <span class="title"><ski-icon icon="paperclip" /> Ressources associées</span>
        <ski-button v-for="resource in content['linked-resources']" :key="resource.url" :href="resource.url" variant="light">
          <ski-icon v-if="resource.url.endsWith('.pdf')" icon="file-earmark-pdf-fill" /> {{ resource.title }}
        </ski-button>
      </div>
    </div>
    <math-document :document="content" :color="lesson.color" @vue:mounted="onMathDocumentMounted" />
  </div>
  <div v-else>
    <error-display :error="error || 404" />
  </div>
</template>

<style lang="scss">
.lesson-control-buttons {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  column-gap: 8px;
  row-gap: 8px;
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

.copyright {
  font-size: 0.75em;
  color: #939393;
}
</style>
