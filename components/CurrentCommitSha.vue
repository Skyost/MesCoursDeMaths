<script setup>
import { useLazyAsyncData } from '#app'

const { data: commitSha } = useLazyAsyncData(
  'current-commit-sha',
  () => queryContent('/latest-commit')
    .findOne()
)
</script>

<template>
  <span v-if="commitSha">
    <span v-if="commitSha.dataRepository">
      Site web <a :href="`${githubRepo}/commit/${commitSha.websiteRepository.long}`">&#35;{{ commitSha.websiteRepository.short }}</a>.
      <br>Données <u>&#35;{{ commitSha.dataRepository.short }}</u>.
    </span>
    <span v-else>
      Révision <a :href="`${githubRepo}/commit/${commitSha.websiteRepository.long}`">&#35;{{ commitSha.websiteRepository.short }}</a>.
    </span>
  </span>
</template>

<script>
import siteMeta from '~/site/meta'

export default {
  computed: {
    githubRepo () {
      return `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
    }
  }
}
</script>
