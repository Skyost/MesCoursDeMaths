<script setup lang="ts">
import siteMeta from '~/site/meta'

const { data: commitSha } = await useFetch('/_api/latest-commit.json')
const githubRepo = `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
</script>

<template>
  <span v-if="commitSha">
    <span v-if="commitSha.dataRepository">
      Site web <a :href="`${githubRepo}/commit/${commitSha.websiteRepository.long}`">&#35;{{ commitSha.websiteRepository.short }}</a>.
      Données <nuxt-link to="/cours/">&#35;{{ commitSha.dataRepository.short }}</nuxt-link>.
    </span>
    <span v-else-if="commitSha.websiteRepository">
      Révision <a :href="`${githubRepo}/commit/${commitSha.websiteRepository.long}`">&#35;{{ commitSha.websiteRepository.short }}</a>.
    </span>
  </span>
</template>
