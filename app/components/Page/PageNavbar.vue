<script setup lang="ts">
const theme = useTheme()
</script>

<template>
  <b-navbar
    class="page-navbar"
    v-b-color-mode="'dark'"
    data-bs-theme="dark"
    toggleable="lg"
    :variant="theme === 'light' ? 'primary' : 'black'"
  >
    <page-navbar-brand class="d-none d-lg-inline" />
    <b-navbar-toggle target="page-navbar-collapse" />
    <b-collapse
      id="page-navbar-collapse"
      is-nav
    >
      <b-navbar-nav class="ms-auto">
        <b-nav-item
          class="page-navbar-item"
          to="/"
          :active="$route.path === '/'"
        >
          <icon name="bi:house-door-fill" /> Accueil
        </b-nav-item>
        <b-nav-item
          class="page-navbar-item"
          to="/cours/"
          :active="$route.path.startsWith('/cours')"
        >
          <icon name="bi:bookmark-fill" /> Accéder aux cours
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <page-navbar-brand class="mobile-navbar-brand" />
  </b-navbar>
</template>

<style lang="scss" scoped>
@import '~/assets/bootstrap-mixins';
@import '~/assets/colors';

.page-navbar {
  #page-navbar-collapse {
    @include media-breakpoint-down(lg) {
      .page-navbar-item {
        background-color: darken($primary, 5%);

        &:first-child {
          margin-top: 20px;
        }

        &:last-child {
          margin-bottom: 20px;
        }

        :deep(a) {
          padding: 10px;
        }
      }
    }
  }

  .mobile-navbar-brand {
    position: absolute;
    top: var(--bs-navbar-padding-y);
    right: var(--bs-navbar-padding-x);

    @include media-breakpoint-up(lg) {
      display: none;
    }
  }
}

@include color-mode(dark) {
  .page-navbar #page-navbar-collapse {
    @include media-breakpoint-down(lg) {
      .page-navbar-item {
        background-color: $dark;
      }
    }
  }
}
</style>
