<script setup lang="ts">
import siteMeta from '~/site/meta'
</script>

<template>
  <header class="page-header-parent">
    <b-container class="page-header">
      <img
        class="page-header-image main"
        src="/images/main.svg"
        :alt="siteMeta.title"
      >
      <client-only>
        <div class="page-header-navigation">
          <page-navigation />
        </div>
      </client-only>
    </b-container>
  </header>
</template>

<style lang="scss" scoped>
@import '~/assets/bootstrap-mixins';
@import '~/assets/colors';

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

      @include media-breakpoint-down(lg) {
        position: relative;
        max-width: 50%;
        margin-top: 50px;
        margin-bottom: 50px;
      }

      @include media-breakpoint-down(md) {
        max-width: 80%;
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

@include color-mode(dark) {
  .page-header-parent {
    background-color: black;
  }
}
</style>
