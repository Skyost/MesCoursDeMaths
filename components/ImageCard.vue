<template>
  <nuxt-link class="image-card" :class="color" :to="to">
    <ski-columns>
      <ski-column v-if="image" width="3">
        <img class="image" :src="image" :alt="title">
      </ski-column>
      <ski-column :width="image ? '9' : '12'">
        <span v-if="subtitle" class="subtitle" v-text="subtitle" />
        <h2 class="title" v-text="title" />
      </ski-column>
    </ski-columns>
  </nuxt-link>
</template>

<script>
import { SkiColumn, SkiColumns } from 'skimple-components'

export default {
  name: 'ImageCard',
  components: { SkiColumns, SkiColumn },
  props: {
    color: {
      type: String,
      default: 'red'
    },
    to: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/colors';

.image-card {
  display: block;
  color: var(--bs-body-color) !important;
  text-decoration: none !important;
  background-color: $light;
  padding: 15px;
  transition: background-color 200ms;
  height: 100%;

  .image {
    width: 100%;
  }

  .title {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
    margin-top: 10px;
  }

  .subtitle {
    display: block;
    text-transform: uppercase;
    font-weight: lighter;
    border-bottom: 1px solid white;
  }

  &:hover {
    background-color: darken($light, 3%);
  }

  &.red .subtitle {
    color: $red;
    border-bottom-color: $red;
  }

  &.blue .subtitle {
    color: $blue;
    border-bottom-color: $blue;
  }

  &.teal .subtitle {
    color: $teal;
    border-bottom-color: $teal;
  }

  &.amber .subtitle {
    color: $yellow;
    border-bottom-color: $yellow;
  }
}
</style>
