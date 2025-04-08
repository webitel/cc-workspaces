<template>
  <wt-icon-btn
    class="pin-action"
    :icon="pinned ? 'unpin' : 'pin'"
    size="sm"
    @click="$emit('click')"
  ></wt-icon-btn>
</template>

<script>
export default {
  name: 'PinAction',
  props: {
    pinned: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
