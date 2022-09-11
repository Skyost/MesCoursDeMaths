<template>
  <ski-navbar brightness="primary" class="navbar-dark">
    <ski-navbar-collapse id="page-navbar-collapse">
      <ski-navbar-brand class="d-none d-lg-inline">
        <img class="logo" src="/images/logo.svg" alt="Logo">
      </ski-navbar-brand>
      <ski-navbar-items class="me-auto">
        <ski-navbar-item to="/" :active="$route.path === '/'">
          <ski-icon icon="house-door-fill" /> Accueil
        </ski-navbar-item>
        <ski-navbar-item to="/cours/" :active="$route.path.startsWith('/cours')">
          <ski-icon icon="bookmark-fill" /> Accéder aux cours
        </ski-navbar-item>
      </ski-navbar-items>
      <ski-navbar-items>
        <ski-navbar-item to="/prof/" :active="$route.path.startsWith('/prof')">
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
