<script setup lang="ts">
import { siteMeta } from '~/site/meta'

withDefaults(defineProps<{
  dataRepositoryLink?: string
}>(), {
  dataRepositoryLink: `https://github.com/${siteMeta.github.username}/${siteMeta.github.dataRepository}`
})

const { data: commitSha } = useLazyAsyncData(
  'current-commit-sha',
  () => queryContent('/latest-commit')
    .findOne()
)
const githubRepo = `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
</script>

<template>
  <span v-if="commitSha">
    <span v-if="commitSha.dataRepository">
      Site web <a :href="`${githubRepo}/commit/${commitSha.websiteRepository.long}`">&#35;{{ commitSha.websiteRepository.short }}</a>.
      Données <a :href="dataRepositoryLink">&#35;{{ commitSha.dataRepository.short }}</a>.
    </span>
    <span v-else>
      Révision <a :href="`${githubRepo}/commit/${commitSha.websiteRepository.long}`">&#35;{{ commitSha.websiteRepository.short }}</a>.
    </span>
  </span>
</template>
