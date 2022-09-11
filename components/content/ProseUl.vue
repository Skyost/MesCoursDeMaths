<template>
  <ul>
    <slot />
  </ul>
</template>

<style lang="scss" scoped>
ul :deep(li) {
  list-style-type: '— ';

  &:last-child,
  &:last-child > p {
    margin-bottom: 0;
  }
}
</style>
