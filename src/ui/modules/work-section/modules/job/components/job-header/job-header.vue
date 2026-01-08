<template>
  <task-header :size="size">
    <template #title>{{ task.displayName }}</template>
    <template #subtitle>{{ task.displayNumber }}</template>

    <template #queue>
      <queue-name-chip :name="queueName" />
    </template>
  </task-header>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import { getQueueName } from '../../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import QueueNameChip from '../../../_shared/components/queue-name-chip/queue-name-chip.vue';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';

export default {
  name: 'JobHeader',
  components: { QueueNameChip, TaskHeader },
  mixins: [sizeMixin],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    queueName() {
      return getQueueName(this.task);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
