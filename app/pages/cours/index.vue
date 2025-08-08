<script lang="ts">
export const gradesNavigationEntry = {
  title: 'Liste des niveaux',
  to: '/cours/',
  depth: 0
}
</script>

<script setup lang="ts">
import type { Grade } from '~/types'
import { getGradeRoute } from '~/site/lessons'

const { data: grades, status, error } = await useFetch<Grade[]>(`/_api/latex/`)

useNavigationEntry(gradesNavigationEntry)
usePageHead({ title: 'Liste des niveaux' })
</script>

<template>
  <div>
    <h1>Liste des niveaux</h1>
    <div v-if="status === 'pending'">
      <spinner />
    </div>
    <b-row
      v-else-if="grades && grades.length > 0"
      class="justify-content-center"
    >
      <b-col
        v-for="grade in grades"
        :key="grade.id"
        xs="12"
        md="6"
        lg="4"
        class="mt-3"
      >
        <image-card
          :title="grade.name"
          :color="grade.color"
          :subtitle="`Cours de ${grade.short}`"
          :to="getGradeRoute(grade)"
          :image="`/images/${grade.id}/image.svg`"
        />
      </b-col>
    </b-row>
    <div v-else>
      <error-display
        :change-title="true"
        :error="error ?? 404"
      />
    </div>
  </div>
</template>
