<template>
  <hr class="divider">
</template>

<script>
  export default {
    name: 'divider',
  };
</script>

<style lang="scss" scoped>
  .divider {
    display: block;
    max-width: 100%;
    height: 0;
    max-height: 0;
    padding: 0;
    margin: 0;
    border: calcRem(1px) solid $page-bg-color;
    border-top-width: thin;
  }
</style>
