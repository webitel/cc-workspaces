<template>
  <task-header :size="props.size">
    <template #info>
      <task-header-expansion-card
        :username="task.displayName"
        :phone-number="task.displayNumber"
        :queue-name="queueName"
      />
    </template>
  </task-header>
</template>

<script setup lang="ts">
import { getQueueName } from '../../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';
import { computed } from 'vue';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import TaskHeaderExpansionCard from '../../../_shared/components/task-header-expansion-card/task-header-expansion-card.vue';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		task: object;
	}>(),
	{
		size: ComponentSize.MD,
	},
);
const queueName = computed(() => getQueueName(props.task));
</script>

<style lang="scss" scoped>

</style>
