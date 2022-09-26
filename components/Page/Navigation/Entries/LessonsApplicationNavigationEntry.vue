<template>
  <page-navigation-entry title="Cours" to="/prof/cours/" :depth="1" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'LessonsApplicationNavigationEntry',
  components: { PageNavigationEntry }
}
</script>
