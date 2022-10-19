<template>
  <ul>
    <slot />
  </ul>
</template>

<style lang="scss" scoped>
ul {
  padding-left: 1.5rem;

  :deep(li) {
    list-style-type: '— ';
    padding-left: 1rem;

    &::marker {
      font-weight: bold;
    }

    &:last-child,
    &:last-child > p {
      margin-bottom: 0;
    }
  }
}
</style>
