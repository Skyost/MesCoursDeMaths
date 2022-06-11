<template>
  <div v-if="$fetchState.pending">
    <spinner />
  </div>
  <div v-else-if="lesson">
    <social-head :title="title" />
    <levels-navigation-entry />
    <lessons-navigation-entry :level="$route.params.level" />
    <lesson-navigation-entry :level="$route.params.level" :lesson="lesson" />
    <div>
      <div class="lesson-control-buttons">
        <span class="title"><ski-icon icon="list" /> Navigation</span>
        <ski-button variant="light" :to="`/cours/${$route.params.level}/`">
          <ski-icon icon="arrow-left" /> Retourner à la liste des cours
        </ski-button>
        <ski-button variant="light" :href="`/pdf/${$route.params.level}/${lesson.slug}.pdf`">
          <ski-icon icon="file-earmark-pdf-fill" /> Télécharger le PDF
        </ski-button>
      </div>
      <div v-if="lesson['linked-resources'].length > 0" class="lesson-control-buttons">
        <span class="title"><ski-icon icon="paperclip" /> Ressources associées</span>
        <ski-button v-for="resource in lesson['linked-resources']" :key="resource.url" :href="resource.url" variant="light">
          <ski-icon v-if="resource.url.endsWith('.pdf')" icon="file-earmark-pdf-fill" /> {{ resource.title }}
        </ski-button>
      </div>
    </div>
    <math-document :document="lesson" :color="documentColor" />
  </div>
  <div v-else>
    <error-display :error-code="404" />
  </div>
</template>

<script>
import { SkiButton, SkiIcon } from 'skimple-components'
import LevelsNavigationEntry from '~/components/Page/Navigation/Entries/LevelsNavigationEntry'
import LessonsNavigationEntry from '~/components/Page/Navigation/Entries/LessonsNavigationEntry'
import LessonNavigationEntry from '~/components/Page/Navigation/Entries/LessonNavigationEntry'
import levelUtils from '~/utils/level'

export default {
  components: { LessonNavigationEntry, LessonsNavigationEntry, LevelsNavigationEntry, SkiButton, SkiIcon },
  data () {
    return {
      lesson: null
    }
  },
  async fetch () {
    this.lesson = await this.$content(this.$route.params.level, this.$route.params.slug)
      .fetch()
  },
  head () {
    return {
      title: this.title
    }
  },
  computed: {
    title () {
      if (this.$fetchState.pending) {
        return 'Chargement...'
      }
      return this.lesson ? `${levelUtils.getLevelName(this.$route.params.level)} > ${this.lesson['page-title']}` : "Affichage d'un cours"
    },
    documentColor () {
      return levelUtils.getLevelColor(this.$route.params.level)
    }
  }
}
</script>

<style lang="scss">
.lesson-control-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  column-gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;

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
