<template>
  <ski-container class="position-relative pt-5 pb-5">
    <slot />
  </ski-container>
</template>

<script>
import { SkiContainer } from 'skimple-components'

export default {
  name: 'PageContent',
  components: { SkiContainer }
}
</script>

<style lang="scss" scoped>
::v-deep h1,
::v-deep h2,
::v-deep h3,
::v-deep h4,
::v-deep h5 {
  border-bottom: 1px solid rgba(black, 0.25);
  padding-bottom: 0.2em;
  margin-bottom: 0.5em;
}

::v-deep .modal-header h5 {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

::v-deep code {
  font-size: 1em;
}

::v-deep a:not([role='button']) {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
