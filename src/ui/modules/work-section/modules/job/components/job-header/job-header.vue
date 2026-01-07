<template>
  <task-header :size="size">
    <template #title>{{ task.displayName }}</template>
    <template #subtitle>{{ task.displayNumber }}</template>
    <template v-if="queueName" #queue>
      <wt-chip color="secondary">
        {{ queueName }}
      </wt-chip>
    </template>
  </task-header>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import { getQueueName } from '../../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';

export default {
  name: 'JobHeader',
  components: { TaskHeader },
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
