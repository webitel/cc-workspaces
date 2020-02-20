<template>
  <button class="rounded-action" type="button">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'rounded-action',
  };
</script>

<style lang="scss" scoped>
  .rounded-action {
    border-radius: 50%;
  }
</style>
