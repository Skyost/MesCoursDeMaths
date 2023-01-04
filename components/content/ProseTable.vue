<template>
  <div class="table-responsive">
    <table class="table table-bordered table-hover">
      <slot />
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table {
  background-color: white;

  :deep(td) {
    height: 2.5em;
  }
}
</style>
