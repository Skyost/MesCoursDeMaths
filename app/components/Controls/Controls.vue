<template>
  <div class="controls">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.controls :deep(.controls-section) {
  margin-bottom: 1rem;

  &:last-of-type {
    margin-bottom: 24px;
  }
}
</style>
