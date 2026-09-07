<template>
  <task-header :size="props.size" :username="task.displayName">
    <template #info>
      <task-header-info
        :title="title"
        :queue-name="queueName"
        :username="task.displayName"
        :size="size"
      />
    </template>
  </task-header>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Task } from 'webitel-sdk';
import { getQueueName } from '../../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';
import TaskHeaderInfo from '../../../_shared/components/task-header/task-header-info.vue';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		task: Task;
	}>(),
	{
		size: ComponentSize.MD,
	},
);

const { t } = useI18n();

const title = computed(
	() =>
		props.task.displayName ||
		t('workspaceSec.taskHeaderExpansionCard.unknownContact'),
);

const queueName = computed(() => getQueueName(props.task));
</script>
