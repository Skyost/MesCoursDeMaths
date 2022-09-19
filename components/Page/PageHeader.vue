<template>
  <header class="page-header-parent">
    <ski-container class="page-header">
      <img class="page-header-image main" src="/images/layout/main.svg" alt="Maths">
      <img class="page-header-image secondary" src="/images/layout/secondary.svg" alt="Maths">
      <div class="page-header-text">
        <h1 class="page-header-title" v-text="title" />
        <span class="page-header-navigation">
          <page-navigation />
        </span>
      </div>
    </ski-container>
  </header>
</template>

<script>
import { SkiContainer } from 'skimple-components'
import siteMeta from '~/site/meta'
import PageNavigation from '@/components/Page/Navigation/PageNavigation'

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
  color: darken($primary, 10%);
  background-color: $header;

  .page-header {
    position: relative;
    text-align: center;
    padding: 40px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @include media-breakpoint-down(lg) {
      min-height: 0;
    }
  }

  .page-header-image {
    position: absolute;

    &.main {
      top: 10%;
      left: 20px;
      height: 110%;
      max-width: 30%;

      @include media-breakpoint-down(md) {
        max-width: 90%;
      }

      @include media-breakpoint-down(lg) {
        position: relative;
        max-width: 50%;
        margin-bottom: 15px;
      }
    }

    &.secondary {
      top: 20%;
      right: 40px;
      height: 60%;
      max-width: 30%;

      @include media-breakpoint-down(lg) {
        display: none;
      }
    }
  }

  .page-header-text {
    max-width: 40%;

    .page-header-title {
      font-size: 3rem;
    }

    .page-header-navigation {
      display: block;
    }

    @include media-breakpoint-down(lg) {
      max-width: 100%;
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
