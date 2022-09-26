<template>
  <page-navigation-entry title="Accès enseignant" to="/prof/" :depth="0" />
</template>

<script>
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'

export default {
  name: 'TeacherNavigationEntry',
  components: { PageNavigationEntry }
}
</script>
