<script setup>
import { useLazyAsyncData, useRoute } from '#app'
import siteLevels from '~/site/levels'

const route = useRoute()
const { pending, data: levels, error } = useLazyAsyncData(
  route.path,
  async () => {
    const mdFiles = await queryContent('/')
      .only(['_file', '_extension'])
      .where({ _extension: 'md' })
      .find()
    let levels = {}
    for (const mdFile of mdFiles) {
      const levelId = mdFile._file.split('/')[0]
      if (!Object.prototype.hasOwnProperty.call(levels, levelId)) {
        levels[levelId] = {
          id: levelId,
          title: siteLevels[levelId].name,
          number: siteLevels[levelId].number,
          subtitle: `Cours de ${siteLevels[levelId].number}e`,
          color: siteLevels[levelId].color,
          url: `/cours/${levelId}/`,
          image: `/images/levels/${levelId}.svg`
        }
      }
    }
    levels = Object.values(levels)
    levels.sort((a, b) => (a.number < b.number ? 1 : (a.number > b.number ? -1 : 0)))
    return levels
  }
)
</script>

<template>
  <div v-if="pending">
    <spinner />
  </div>
  <div v-else-if="error">
    <error-display :error="error" />
  </div>
  <div v-else>
    <page-head title="Liste des niveaux" />
    <levels-navigation-entry />
    <h1>Liste des niveaux</h1>
    <ski-columns v-if="levels && levels.length > 0" class="justify-content-center">
      <ski-column
        v-for="level in levels"
        :key="level.id"
        xs="12"
        md="6"
        lg="4"
        class="mt-3"
      >
        <image-card
          :title="level.title"
          :color="level.color"
          :subtitle="level.subtitle"
          :to="level.url"
          :image="level.image"
        />
      </ski-column>
    </ski-columns>
    <div v-else class="text-center">
      <em class="text-muted">Il n'y a pas de cours disponible.</em>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/order
import { SkiColumn, SkiColumns } from 'skimple-components'
import PageHead from '~/components/Page/PageHead'
import ImageCard from '~/components/ImageCard'
import LevelsNavigationEntry from '~/components/Page/Navigation/Entries/LevelsNavigationEntry'
import Spinner from '~/components/Spinner.vue'
import ErrorDisplay from '~/components/ErrorDisplay.vue'

export default {
  components: { PageHead, LevelsNavigationEntry, SkiColumns, SkiColumn, ImageCard, Spinner, ErrorDisplay }
}
</script>
