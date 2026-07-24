<template>
  <lookup-item>
    <template #before>
      <wt-avatar
          :status="status"
          :size="size"
          :username="item.name"
          badge
      />
    </template>

    <template #title>
      {{ item.name || item.username }}
    </template>

    <template #subtitle>
      {{ item.extension }}
    </template>

    <template #after>
      <wt-rounded-action
          :size="props.size"
          :loading="props.loading"
          icon="call--filled"
          color="success"
          rounded
          @click="handleInput"
      />
    </template>
  </lookup-item>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { getUserStatusByPriority } from '../../../../../../../features/modules/agent-status/statusUtils/getUserStatusByPriority';
import LookupItem from './lookup-item.vue';
import { UserLookupItem } from './types/UserLookupItem';

const props = withDefaults(
	defineProps<{
		item: UserLookupItem;
		loading?: boolean;
		size?: string;
	}>(),
	{
		loading: false,
		size: ComponentSize.MD,
	},
);

const emit = defineEmits<{
	input: [
		UserLookupItem,
	];
}>();

const status = computed(() =>
	getUserStatusByPriority({
		presence: props.item.presence,
		agentStatus: props.item.status,
	}),
);

const handleInput = () => {
	if (props.loading) return;

	emit('input', props.item);
};
</script>

<style lang="scss" scoped>
</style>
