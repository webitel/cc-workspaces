<template>
  <wt-icon-btn
    class="collapse-action"
    :icon="collapsed ? 'expand' : 'collapse'"
    size="sm"
    color="icon-secondary"
    @click="$emit('click')"
  ></wt-icon-btn>
</template>

<script>
export default {
  name: 'collapse-action',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
