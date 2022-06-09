<template>
  <ski-navbar brightness="primary" class="navbar-dark">
    <ski-navbar-collapse>
      <ski-navbar-brand>
        <img class="logo" src="/images/logo.svg" alt="Logo">
      </ski-navbar-brand>
      <ski-navbar-items class="me-auto">
        <ski-navbar-item to="/" :active="$nuxt.$route.path === '/'">
          <ski-icon icon="house-door-fill" /> Accueil
        </ski-navbar-item>
        <ski-navbar-item to="/cours/" :active="$nuxt.$route.path.startsWith('/cours')">
          <ski-icon icon="bookmark-fill" /> Liste des cours
        </ski-navbar-item>
      </ski-navbar-items>
      <ski-navbar-items>
        <ski-navbar-item to="/prof/" :active="$nuxt.$route.path.startsWith('/prof')">
          <ski-icon icon="mortarboard-fill" /> Accès enseignant
        </ski-navbar-item>
      </ski-navbar-items>
    </ski-navbar-collapse>
  </ski-navbar>
</template>

<script>
import {
  SkiIcon,
  SkiNavbar,
  SkiNavbarBrand,
  SkiNavbarCollapse,
  SkiNavbarItem,
  SkiNavbarItems
} from 'skimple-components'

export default {
  name: 'PageNavbar',
  components: { SkiNavbar, SkiNavbarBrand, SkiNavbarCollapse, SkiNavbarItems, SkiNavbarItem, SkiIcon },
  data () {
    return {
      request: null
    }
  }
}
</script>

<style lang="scss">
.logo {
  height: 1.5em;
}
</style>
