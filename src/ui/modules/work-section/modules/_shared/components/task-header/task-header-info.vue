<template>
	<div class="task-header-info info">
		<div class="info__user">
			<div class="info__user__name">
				<wt-avatar
					v-if="withAvatar"
					:size="ComponentSize.XS"
					:username="avatarTitle"
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
			<div class="info__user__phone">
				<span class="typo-body-2">{{ phoneNumber }}</span>
			</div>
		</div>
		<p
			v-if="queueName"
			class="info__queue typo-caption-bold"
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
		avatarTitle?: string;
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
	.info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xs);
		padding: var(--spacing-xs);
		border-radius: var(--border-radius--md);
		background-color: var(--light-blue-lighten-5);
	}

	.info__user {
		display: flex;
		gap: var(--spacing-2xs);
		align-items: center;
		justify-content: space-between;
	}

	.info__user__name {
		display: flex;
		gap: var(--spacing-xs);
		align-items: center;
	}

	.info__user a:hover {
  text-decoration: underline;
}

	.info__queue {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.info__queue span {
		margin-right: var(--spacing-2xs);
	}
</style>