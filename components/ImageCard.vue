<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  to: string
  subtitle?: string | undefined
  title?: string | undefined
  image?: string | undefined
}>(), {
  color: 'blue',
  subtitle: undefined,
  title: undefined,
  image: undefined
})
</script>

<template>
  <nuxt-link
    class="image-card"
    :class="color"
    :to="to"
  >
    <b-row>
      <b-col
        v-if="image"
        cols="3"
      >
        <img
          class="image"
          :src="image"
          :alt="title || subtitle"
        >
      </b-col>
      <b-col :cols="image ? '9' : '12'">
        <span
          v-if="subtitle"
          class="subtitle"
          v-text="subtitle"
        />
        <h2
          v-if="title"
          class="title"
          v-text="title"
        />
        <slot />
      </b-col>
    </b-row>
  </nuxt-link>
</template>

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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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

  &.pink .subtitle {
    color: $pink;
    border-bottom-color: $pink;
  }

  &.indigo .subtitle {
    color: $indigo;
    border-bottom-color: $indigo;
  }
}
</style>
