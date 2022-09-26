<template>
  <page-navigation-entry title="Liste des niveaux" to="/cours/" :depth="0" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'LevelsNavigationEntry',
  components: { PageNavigationEntry }
}
</script>
