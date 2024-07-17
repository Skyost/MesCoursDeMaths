<script lang="ts">
export const levelsNavigationEntry = {
  title: 'Liste des niveaux',
  to: '/cours/',
  depth: 0
}
</script>

<script setup lang="ts">
import { getLevelImage, getLevelSubtitle, getLevelUrl, levels } from '~/site/levels'

useNavigationEntry(levelsNavigationEntry)
</script>

<template>
  <div>
    <page-head title="Liste des niveaux" />
    <h1>Liste des niveaux</h1>
    <b-row
      v-if="Object.keys(levels).length > 0"
      class="justify-content-center"
    >
      <b-col
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
          :subtitle="getLevelSubtitle(level)"
          :to="getLevelUrl(level)"
          :image="getLevelImage(level)"
        />
      </b-col>
    </b-row>
  </div>
</template>
