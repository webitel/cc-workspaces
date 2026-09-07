<template>
  <header
    class="task-header"
    :class="[`task-header--${props.size}`]"
  >
    <div class="task-header-actions">
      <task-header-avatar
        v-if="withAvatar"
        :username="props.username"
      />
      <slot name="task-header-actions" />
    </div>
    <div class="task-header-info">
      <slot name="info" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import TaskHeaderAvatar from './task-header-avatar.vue';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		username?: string;
	}>(),
	{
		size: ComponentSize.MD,
	},
);

const withAvatar = computed(
	() => props.size === ComponentSize.SM && !!props.username,
);
</script>

<style scoped>
.task-header-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2xs);
  padding-block: var(--spacing-2xs);
}

.task-header-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}
</style>