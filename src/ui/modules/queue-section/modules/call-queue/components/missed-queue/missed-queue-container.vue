<template>
  <task-queue-container>
    <h3 class="queue-task-container__heading">{{ $t('history.today') }}</h3>
    <missed-preview
      v-for="(task, key) of missedList"
      :key="task.id"
      :task="task"
      :index="key"
      :size="size"
      @click="openCall"
    ></missed-preview>
  </task-queue-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import MissedPreview from './missed-queue-preview.vue';

export default {
  name: 'missed-queue-container',
  mixins: [sizeMixin],
  components: {
    TaskQueueContainer,
    MissedPreview,
  },

  created() {
    this.loadMissedList();
    this.resetNewMissed(); // reset UI flag
  },

  computed: {
    ...mapState('features/call/missed', {
      missedList: (state) => state.missedList,
    }),
  },

  methods: {
    ...mapActions('features/call', {
      openNewCall: 'OPEN_NEW_CALL',
    }),
    ...mapActions('features/call/missed', {
      loadMissedList: 'LOAD_DATA_LIST',
      resetNewMissed: 'RESET_NEW_MISSED',
    }),

    openCall(missed) {
      const newNumber = missed.from.number;
      const historyId = missed.id;
      this.openNewCall({ newNumber, historyId });
    },
  },
};
</script>

<style lang="scss" scoped>
.queue-task-container__heading {
  @extend %typo-body-2;
  margin-bottom: 1px;
  text-align: center;
  color: var(--text-outline-color);
  background: var(--main-color);
}
</style>
