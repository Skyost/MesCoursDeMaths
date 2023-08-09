<script lang="ts">
export const lessonsNavigationEntry = {
  title: 'Cours',
  to: '/prof/cours/',
  depth: 1
}
</script>

<script setup lang="ts">
import Protected from '~/components/Applications/Protected.vue'
import { teacherNavigationEntry } from '~/pages/prof/index.vue'
import LessonsApplication from '~/components/Applications/Lessons/LessonsApplication.vue'

useNavigationEntry(teacherNavigationEntry)
useNavigationEntry(lessonsNavigationEntry)
</script>

<template>
  <div>
    <protected>
      <page-head title="Agenda" />
      <lessons-application />
    </protected>
  </div>
</template>
