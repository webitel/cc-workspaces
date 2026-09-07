<template>
	<div class="task-header-info">
		<div class="task-header-info__user">
			<div class="task-header-info__user-name">
				<wt-avatar
					v-if="withAvatar"
					:size="ComponentSize.XS"
					:username="username"
				/>
				<div class="typo-body-2-bold">
					<a
						v-if="contactName && contactLink"
						:href="contactLink"
						target="_blank"
					>
						{{ contactName }}
					</a>
					<span v-if="title">{{ title }}</span>
				</div>
			</div>
			<div class="task-header-info__user-phone">
				<span class="typo-body-2">{{ phoneNumber }}</span>
			</div>
		</div>
		<p
			v-if="queueName"
			class="task-header-info__queue typo-caption-bold"
		>
			<span class="typo-caption-bold">Queue:</span>
			<span class="typo-caption">{{ queueName }}</span>
		</p>
	</div>
</template>

<script lang="ts" setup>
import { WtAvatar } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		contactName?: string | null;
		contactLink?: string;
		title?: string;
		username?: string;
		phoneNumber?: string;
		queueName?: string;
		size?: ComponentSize;
	}>(),
	{
		size: ComponentSize.MD,
	},
);

const withAvatar = computed(() => props.size === ComponentSize.MD);
</script>

<style scoped>
	.task-header-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xs);
		padding: var(--spacing-xs);
		border-radius: var(--border-radius--md);
		background-color: var(--light-blue-lighten-5);
	}

	.task-header-info__user {
		display: flex;
		gap: var(--spacing-2xs);
		align-items: center;
		justify-content: space-between;
	}

	.task-header-info__user-name {
		display: flex;
		gap: var(--spacing-xs);
		align-items: center;
	}

	.task-header-info__user-name a:hover {
  text-decoration: underline;
}

	.task-header-info__queue {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.task-header-info__queue span:first-child {
		margin-right: var(--spacing-2xs);
	}
</style>