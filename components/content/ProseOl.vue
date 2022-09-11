<template>
  <ol>
    <slot />
  </ol>
</template>

<style lang="scss" scoped>
ol li::marker {
  font-weight: bold;
}
</style>
