<template>
  <div :class="['last-message-container', iconClass]">
    <div>
      <wt-icon :icon="icon" />
    </div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AgentIconType } from '../../enums/AgentIconType.enum';

const props = withDefaults(
	defineProps<{
		icon: AgentIconType | string;
		message: string;
	}>(),
	{
		icon: '',
		message: '',
	},
);

const iconClass = computed(() =>
	props.icon !== AgentIconType.Bot
		? `last-message-container--${props.icon}`
		: null,
);
</script>

<style scoped>
.last-message-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  border-radius: var(--spacing-xs);
}

.last-message-container--contacts {
  background-color: var(--p-primary-highlight-color);
}

.last-message-container--agent {
  background-color: var(--p-secondary-hover-color);
}
</style>
