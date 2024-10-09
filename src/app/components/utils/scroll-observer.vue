<template>
  <wt-loader
    v-if="loading"
    size="sm"
  />
  <div ref="intersectionTarget" />
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  next: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'next',
]);

const intersectionTarget = ref(null);

let stopObs;

onMounted(() => {
  /**
   *
   * Note, observer triggers at init, so it should be used also as init function
   * however, current filters module version is initializing list by itself, so we need to refactor filters ASAP
   */
  const { stop } = useIntersectionObserver(intersectionTarget.value, ([{ isIntersecting }]) => {
    if (isIntersecting && props.next) {
      emit('next');
    }
  });

  stopObs = stop;
});

onUnmounted(() => {
  stopObs();
});
</script>

<style scoped lang="scss">
.wt-loader {
  margin: var(--spacing-lg) auto;
}
</style>
