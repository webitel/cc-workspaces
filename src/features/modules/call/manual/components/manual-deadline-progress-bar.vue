<template>
  <div class="manual-deadline-progress-bar">
    <div
      class="manual-deadline-progress-bar__progress"
      :class="{
        'manual-deadline-progress-bar__progress--warning': deadline > 50,
        'manual-deadline-progress-bar__progress--danger': deadline > 75,
      }"
      :style="`width: ${width}`"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  deadline: {
    type: Number,
    required: true,
  },
});

const width = computed(() => (props.deadline <= 100 ? `${props.deadline}%` : '100%'));
</script>

<style lang="scss" scoped>
.manual-deadline-progress-bar {
  width: 100%;
  height: 1px;
  background-color: var(--secondary-color-50);

  .manual-deadline-progress-bar__progress {
    height: 1px;
    background-color: var(--true-color);

    &--warning {
      background-color: var(--accent-color);
    }

    &--danger {
      background-color: var(--false-color);
    }
  }
}
</style>
