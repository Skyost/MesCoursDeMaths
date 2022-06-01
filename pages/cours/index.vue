<template>
  <div>
    <social-head title="Liste des niveaux" />
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
import { SkiColumn, SkiColumns } from 'skimple-components'
import ImageCard from '~/components/ImageCard'
import level from '~/utils/level'

export default {
  components: { SkiColumns, SkiColumn, ImageCard },
  data () {
    return {
      levels: null
    }
  },
  async fetch () {
    const fetchedLevels = await this.$content('', { deep: true })
      .where({ extension: '.md' })
      .only(['dir'])
      .fetch()
    let levels = {}
    for (const fetchedLevel of fetchedLevels) {
      const levelId = fetchedLevel.dir.substring(1)
      if (!Object.prototype.hasOwnProperty.call(levels, levelId)) {
        levels[levelId] = {
          id: levelId,
          title: level.getLevelName(levelId),
          number: level.getLevelAsNumber(levelId),
          subtitle: `Cours de ${level.getLevelAsNumber(levelId)}e`,
          color: level.getLevelColor(levelId),
          url: `/cours/${levelId}/`,
          image: `/images/levels/${levelId}.svg`
        }
      }
    }
    levels = Object.values(levels)
    levels.sort((a, b) => (a.number < b.number ? 1 : (a.number > b.number ? -1 : 0)))
    this.levels = levels
  },
  head: {
    title: 'Liste des niveaux'
  }
}
</script>
