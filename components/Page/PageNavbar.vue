<template>
  <ski-navbar brightness="primary" class="navbar-dark">
    <ski-navbar-collapse id="page-navbar-collapse">
      <page-navbar-brand class="d-none d-lg-inline" />
      <ski-navbar-items class="ms-auto">
        <ski-navbar-item to="/" :active="$route.path === '/'">
          <ski-icon icon="house-door-fill" /> Accueil
        </ski-navbar-item>
        <ski-navbar-item to="/cours/" :active="$route.path.startsWith('/cours')">
          <ski-icon icon="bookmark-fill" /> Accéder aux cours
        </ski-navbar-item>
      </ski-navbar-items>
    </ski-navbar-collapse>
    <page-navbar-brand class="mobile-navbar-brand" />
  </ski-navbar>
</template>

<script>
import { SkiIcon, SkiNavbar, SkiNavbarCollapse, SkiNavbarItem, SkiNavbarItems } from 'skimple-components'
import PageNavbarBrand from '~/components/Page/PageNavbarBrand'

export default {
  name: 'PageNavbar',
  components: { PageNavbarBrand, SkiNavbar, SkiNavbarCollapse, SkiNavbarItems, SkiNavbarItem, SkiIcon },
  data () {
    return {
      request: null
    }
  }
}
</script>

<style lang="scss">
@import 'assets/bootstrap-mixins';

.mobile-navbar-brand {
  position: absolute;
  top: var(--bs-navbar-padding-y);
  right: var(--bs-navbar-padding-x);

  @include media-breakpoint-up(lg) {
    display: none;
  }
}
</style>
