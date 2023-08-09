<script lang="ts">
export const agendaNavigationEntry = {
  title: 'Agenda',
  to: '/prof/agenda/',
  depth: 1
}
</script>

<script setup lang="ts">
import Protected from '~/components/Applications/Protected.vue'
import { teacherNavigationEntry } from '~/pages/prof/index.vue'
import AgendaApplication from '~/components/Applications/Agenda/AgendaApplication.vue'

useNavigationEntry(teacherNavigationEntry)
useNavigationEntry(agendaNavigationEntry)
</script>

<template>
  <div>
    <protected>
      <page-head title="Agenda" />
      <agenda-application />
    </protected>
  </div>
</template>
