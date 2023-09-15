<template>
  <task-queue-container>
    <manual-preview
      v-for="(task, key) of manualList"
      :key="task.id"
      :task="task"
      :index="key"
      :size="size"
      @click="openCall"
    ></manual-preview>
  </task-queue-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ManualPreview from './manual-queue-preview.vue';

export default {
  name: 'manual-queue-container',
  mixins: [sizeMixin],
  components: {
    TaskQueueContainer,
    ManualPreview,
  },

  computed: {
    ...mapState('features/call/manual', {
      manualList: (state) => state.manualList,
    }),
  },
};
</script>

<style lang="scss" scoped>

</style>
