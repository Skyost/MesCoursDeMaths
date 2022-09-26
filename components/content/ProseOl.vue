<template>
  <ol>
    <slot />
  </ol>
</template>

<style lang="scss" scoped>
ol :deep(li::marker) {
  font-weight: bold;
}

ol :deep(> li > ol) {
  list-style-type: lower-alpha;
}
</style>
