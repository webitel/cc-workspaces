<template>
  <wt-transition
    class="wt-replace-transition"
    :duration="props.duration"
    :name="transitionName"
  >
    <template #default>
      <slot />
    </template>
  </wt-transition>
</template>

<script setup>
import { computed } from 'vue';

import WtTransition from './wt-transition.vue';

const props = defineProps({
  // can choose replace pattern [opacity, slide ets]
  // ATTENTION!! need to add another names(patterns) to <wt-transition/>, now we have fade-opacity only
  pattern: {
    type: String,
    default: 'opacity',
  },
  duration: {
    type: String,
    default: 'md',
  },
  appear: {
    type: Boolean,
    default: false,
  },
});

const transitionName = computed(() => `fade-${props.pattern}`);
</script>

<style lang="scss" scoped></style>
