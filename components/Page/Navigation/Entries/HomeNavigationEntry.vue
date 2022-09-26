<template>
  <page-navigation-entry title="Page d'accueil" to="/" :depth="0" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'HomeNavigationEntry',
  components: { PageNavigationEntry }
}
</script>
