<script setup lang="ts">
const navigationEntries = useNavigationEntries()
</script>

<template>
  <span v-if="navigationEntries.length > 0">
    <ski-icon icon="geo-alt-fill" />&nbsp;
    <span v-for="(navigationEntry, index) of navigationEntries" :key="navigationEntry.to">
      <nuxt-link :to="navigationEntry.to">{{ navigationEntry.title }}</nuxt-link><ski-icon v-if="index < navigationEntries.length - 1" icon="chevron-right" />
    </span>
  </span>
</template>
