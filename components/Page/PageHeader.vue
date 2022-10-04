<template>
  <header class="page-header-parent">
    <ski-container class="page-header">
      <img class="page-header-image main" src="/images/main.svg" :alt="title">
      <span class="page-header-navigation">
        <ski-icon icon="geo-alt-fill" /> <page-navigation />
      </span>
    </ski-container>
  </header>
</template>

<script>
import { SkiContainer } from 'skimple-components'
import siteMeta from '~/site/meta'
import PageNavigation from '~/components/Page/Navigation/PageNavigation'

export default {
  name: 'PageHeader',
  components: { PageNavigation, SkiContainer },
  computed: {
    title () {
      return siteMeta.title
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/bootstrap-mixins';
@import 'assets/colors';

.page-header-parent {
  position: relative;
  color: $light;
  background-color: $primary;

  .page-header {
    position: relative;
    text-align: center;
    min-height: 300px;

    @include media-breakpoint-down(lg) {
      min-height: 0;
    }
  }

  .page-header-image {
    position: absolute;

    &.main {
      top: 0;
      left: 20px;
      height: 120%;
      max-width: 30%;

      @include media-breakpoint-down(md) {
        max-width: 90%;
      }

      @include media-breakpoint-down(lg) {
        position: relative;
        max-width: 50%;
        margin-bottom: 40px;
      }
    }
  }

  .page-header-navigation {
    position: absolute;
    bottom: 0.5rem;
    right: calc(var(--bs-gutter-x) * 0.5);
    font-size: 0.6em;

    &:deep(a) {
      color: white !important;
      text-decoration: none !important;
    }
  }

  > * {
    z-index: 2;
  }

  hr {
    opacity: 1;
  }
}
</style>
