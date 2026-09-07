
<template>
  <div class="task-header-avatar">
    <wt-avatar
      :size="ComponentSize.XS"
      :username="username"
    />
  </div>
</template>

<script setup lang="ts">
import { WtAvatar } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';

defineProps<{
	username?: string;
}>();
</script>

<style scoped>
.task-header-avatar {
	flex-shrink: 0;
	flex-grow: 0;
	padding: var(--spacing-2xs);
	box-shadow: var(--elevation-4);
	color: var(--white);
	border-radius: var(--border-radius--md);
}
</style>