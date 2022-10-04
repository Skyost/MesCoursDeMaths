<script setup>
import { useLazyAsyncData } from '#app'

const { data: commitSha } = useLazyAsyncData(
  'current-commit-sha',
  () => queryContent('/latest-commit')
    .findOne()
)
</script>

<template>
  <span v-if="commitSha">Révision <a :href="`${githubRepo}/commit/${commitSha.long}`">&#35;{{ commitSha.short }}</a>.</span>
</template>

<script>
import siteMeta from '~/site/meta'

export default {
  name: 'CurrentCommitSha',
  computed: {
    githubRepo () {
      return `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
    }
  }
}
</script>
