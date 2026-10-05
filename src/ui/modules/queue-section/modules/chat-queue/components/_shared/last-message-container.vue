<template>
  <div :class="['last-message-container', iconClass]">
    <div>
      <wt-icon :icon="icon" />
    </div>
    <p class="last-message-container--text">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AgentIcon } from '../../enums/AgentIcon.enum';

const props = withDefaults(
	defineProps<{
		icon: AgentIcon | string;
		message: string;
	}>(),
	{
		icon: '',
		message: '',
	},
);

const iconClass = computed(() =>
	props.icon !== AgentIcon.Bot ? `last-message-container--${props.icon}` : null,
);
</script>

<style scoped>
.last-message-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  border-radius: var(--spacing-xs);
  padding: 0 var(--spacing-2xs);
  width: fit-content;
  max-width: 100%;
}

.last-message-container--text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.last-message-container--contacts {
  background-color: var(--p-primary-highlight-color);
}

.last-message-container--agent {
  background-color: var(--p-secondary-hover-color);
}
</style>
