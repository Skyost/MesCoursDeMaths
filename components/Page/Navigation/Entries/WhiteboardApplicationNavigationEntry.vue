<template>
  <page-navigation-entry title="Tableau blanc" to="/prof/tableau-blanc/" :depth="1" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'WhiteboardApplicationNavigationEntry',
  components: { PageNavigationEntry }
}
</script>
