<script lang="ts">
export const levelsNavigationEntry = {
  title: 'Liste des niveaux',
  to: '/cours/',
  depth: 0
}
</script>

<script setup lang="ts">
import { levels as siteLevels } from '~/site/levels'
import { Level } from '~/types'

const route = useRoute()
const { pending, data: levels, error } = useLazyAsyncData(
  route.path,
  async () => {
    const mdFiles = await queryContent('/')
      .only(['_file', '_extension'])
      .where({ _extension: 'md' })
      .find()
    const levels: Set<Level> = new Set<Level>()
    for (const mdFile of mdFiles) {
      const levelId: string = mdFile._file.split('/')[0]
      if (levelId in siteLevels) {
        levels.add(siteLevels[levelId])
      }
    }
    const result = [...levels]
    result.sort((a, b) => (a.number < b.number ? 1 : (a.number > b.number ? -1 : 0)))
    return result
  }
)

useNavigationEntry(levelsNavigationEntry)
</script>

<template>
  <div v-if="pending">
    <spinner />
  </div>
  <div v-else-if="levels">
    <page-head title="Liste des niveaux" />
    <h1>Liste des niveaux</h1>
    <ski-columns v-if="levels.length > 0" class="justify-content-center">
      <ski-column
        v-for="level in levels"
        :key="level.id"
        xs="12"
        md="6"
        lg="4"
        class="mt-3"
      >
        <image-card
          :title="level.name"
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
  <div v-else>
    <error-display :error="error || 404" />
  </div>
</template>
