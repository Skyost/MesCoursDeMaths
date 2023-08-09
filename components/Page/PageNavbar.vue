<template>
  <ski-navbar color="primary" class="navbar-dark">
    <ski-navbar-collapse id="page-navbar-collapse">
      <page-navbar-brand class="d-none d-lg-inline" />
      <ski-navbar-items class="ms-auto">
        <ski-navbar-item class="page-navbar-item" to="/" :active="$route.path === '/'">
          <ski-icon icon="house-door-fill" /> Accueil
        </ski-navbar-item>
        <ski-navbar-item class="page-navbar-item" to="/cours/" :active="$route.path.startsWith('/cours')">
          <ski-icon icon="bookmark-fill" /> Accéder aux cours
        </ski-navbar-item>
      </ski-navbar-items>
    </ski-navbar-collapse>
    <page-navbar-brand class="mobile-navbar-brand" />
  </ski-navbar>
</template>

<style lang="scss" scoped>
@import 'assets/bootstrap-mixins';
@import 'assets/colors';

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
</style>
