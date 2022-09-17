<template>
  <ol>
    <slot />
  </ol>
</template>

<style lang="scss" scoped>
ol :deep(li::marker) {
  font-weight: bold;
}
</style>
