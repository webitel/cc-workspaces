<template>
  <transition name="quick-replies-slide">
    <slot />
  </transition>
</template>

<script setup lang="ts"></script>

<style lang="scss">
/**
 * unscoped: slotted content keeps chat-messaging's own scope id,
 * so a scoped block here would never match it
 */
.quick-replies-slide-enter-active,
.quick-replies-slide-leave-active {
  transition: transform var(--transition);
}

.quick-replies-slide-enter-from,
.quick-replies-slide-leave-to {
  transform: translateY(100%);
}
</style>
