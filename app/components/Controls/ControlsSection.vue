<template>
  <div class="controls-section">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.controls-section {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  gap: 8px;
}
</style>
