<template>
  <transition
    mode="out-in"
    :appear="props.appear"
  >
    <slot />
  </transition>
</template>

<script setup>

const props = defineProps({
  appear: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
  }
});

</script>

<style lang="scss" scoped>
.v-enter-active {
  transition: opacity .3s;
}

.v-enter,
.v-leave-active {
  opacity: 0
}
</style>
