<template>
  <div
    class="agent-indicators"
    :class="[`agent-indicators--${size}`]"
  >
    <wt-indicator
      color="success"
      :text="online"
      :size="size"
    ></wt-indicator>
    <wt-indicator
      color="primary"
      :text="pause"
      :size="size"
    ></wt-indicator>
    <wt-indicator
      color="error"
      :text="busy"
      :size="size"
    ></wt-indicator>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	/**
	 * @description Agents object
	 * @type {Object}
	 * @property {Number} pause
	 * @property {Number} allowPause
	 * @property {Number} online
	 */
	agents: {
		type: Object,
		required: true,
	},
	size: {
		type: String,
		default: 'md',
		options: [
			'sm',
			'md',
		],
	},
});

const pause = computed(() => {
	return props.agents.allowPause !== undefined
		? `${props.agents.pause} / ${props.agents.allowPause}`
		: props.agents.pause;
});

const online = computed(() => {
	return props.agents.online;
});

const busy = computed(() => props.agents.busy)
</script>

<style lang="scss" scoped>
.agent-indicators {
  display: flex;
  justify-content: space-evenly;
  gap: var(--spacing-sm);

  &--sm {
    flex-direction: column;
  }
}
</style>
