<template>
  <task-queue-container
    :empty="!callList.length"
  >
    <active-preview
      v-for="(task, key) of callList"
      :key="task.id"
      :index="key"
      :opened="task === taskOnWorkspace"
      :task="task"
      :size="size"
      @answer="answer({ callId: task.id })"
      @click="openCall"
      @hangup="hangup({ callId: task.id })"
    ></active-preview>
  </task-queue-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ActivePreview from './active-queue-preview.vue';

export default {
  name: 'active-queue-container',
  mixins: [sizeMixin],
  components: {
    TaskQueueContainer,
    ActivePreview,
  },

  computed: {
    ...mapState('features/call', {
      callList: (state) => state.callList,
    }),
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },

  methods: {
    ...mapActions('features/call', {
      openCall: 'OPEN_ACTIVE_CALL',
      answer: 'ANSWER',
      hangup: 'HANGUP',
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
