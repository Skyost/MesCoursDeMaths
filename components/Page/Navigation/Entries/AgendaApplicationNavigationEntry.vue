<template>
  <page-navigation-entry title="Agenda" to="/prof/agenda/" :depth="1" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'AgendaApplicationNavigationEntry',
  components: { PageNavigationEntry }
}
</script>
