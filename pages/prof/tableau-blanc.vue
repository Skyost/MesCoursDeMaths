<script lang="ts">
export const whiteboardNavigationEntry = {
  title: 'Tableau blanc',
  to: '/prof/tableau-blanc/',
  depth: 1
}
</script>

<script setup lang="ts">
import Protected from '~/components/Applications/Protected.vue'
import { teacherNavigationEntry } from '~/pages/prof/index.vue'
import WhiteboardApplication from '~/components/Applications/Whiteboard/WhiteboardApplication.vue'

useNavigationEntry(teacherNavigationEntry)
useNavigationEntry(whiteboardNavigationEntry)
</script>

<template>
  <div>
    <protected>
      <page-head title="Tableau blanc" />
      <whiteboard-application />
    </protected>
  </div>
</template>
