<template>
  <ol>
    <slot />
  </ol>
</template>

<style lang="scss" scoped>
ol {
  padding-left: 1.5rem;

  :deep(li) {
    padding-left: 1rem;

    &::marker {
      font-weight: bold;
    }
  }

  :deep(> li > ol) {
    list-style-type: lower-alpha;
  }
}
</style>
