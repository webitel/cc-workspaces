<template>
  <task-header :size="props.size">
    <template #info>
      {{ task.displayName }}
      {{ task.displayNumber }}
      <queue-name-chip
        v-if="queueName"
        :name="queueName"
      />
    </template>
  </task-header>
</template>

<script setup lang="ts">
import { getQueueName } from '../../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import QueueNameChip from '../../../_shared/components/queue-name-chip/queue-name-chip.vue';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';
import { computed } from 'vue';
import { ComponentSize } from '@webitel/ui-sdk/enums';

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
