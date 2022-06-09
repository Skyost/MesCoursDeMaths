<template>
  <header class="page-header">
    <h1 class="page-header-title" v-text="title" />
    <img class="page-header-image main" src="/images/layout/main.svg" alt="Maths">
    <img class="page-header-image secondary" src="/images/layout/secondary.svg" alt="Maths">
    <span class="page-header-navigation">
      <page-navigation />
    </span>
  </header>
</template>

<script>
import site from '~/site'
import PageNavigation from '@/components/Page/Navigation/PageNavigation'

export default {
  name: 'PageHeader',
  components: { PageNavigation },
  computed: {
    title () {
      return site.site.title
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/app';

.page-header {
  text-align: center;
  position: relative;
  color: darken($primary, 10%);
  background-color: $header;
  padding: 40px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .page-header-title {
    font-size: 3rem;
  }

  .page-header-image {
    position: absolute;

    &.main {
      top: 10%;
      left: 20px;
      height: 110%;
      max-width: 30%;
    }

    &.secondary {
      top: 20%;
      right: 40px;
      height: 60%;
      max-width: 30%;
    }
  }

  .page-header-navigation {
    display: block;
  }

  > * {
    z-index: 2;
  }

  hr {
    opacity: 1;
  }
}
</style>
