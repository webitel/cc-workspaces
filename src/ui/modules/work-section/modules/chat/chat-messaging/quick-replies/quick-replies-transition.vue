<template>
  <transition name="quick-replies-slide">
    <slot />
  </transition>
</template>

<style lang="scss">
.quick-replies-slide-enter-active,
.quick-replies-slide-leave-active {
  transition: transform var(--transition);
}

.quick-replies-slide-enter-from,
.quick-replies-slide-leave-to {
  transform: translateY(100%);
}
</style>
