<script setup lang="ts">
const navigationEntries = useNavigationEntries()
</script>

<template>
  <span v-if="navigationEntries.length > 0">
    <icon name="bi:geo-alt-fill" />&nbsp;
    <span
      v-for="(navigationEntry, index) of navigationEntries"
      :key="navigationEntry.to"
    >
      <nuxt-link :to="navigationEntry.to">{{ navigationEntry.title }}</nuxt-link><icon
        v-if="index < navigationEntries.length - 1"
        name="bi:chevron-right"
      />
    </span>
  </span>
</template>
