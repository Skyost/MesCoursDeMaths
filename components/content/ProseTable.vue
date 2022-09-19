<template>
  <div class="table-responsive">
    <table class="table table-bordered table-hover">
      <slot />
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProseTable'
}
</script>

<style lang="scss" scoped>
.table {
  background-color: white;

  :deep(td) {
    height: 2.5em;
  }
}
</style>
