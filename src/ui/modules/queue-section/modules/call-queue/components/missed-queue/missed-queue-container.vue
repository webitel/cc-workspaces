<template>
  <task-queue-container>
    <missed-preview
      v-for="(task, key) of missedList"
      :key="task.id"
      :task="task"
      :index="key"
      :size="size"
      @click="openCall"
    ></missed-preview>
    <a
      class="missed-queue-container__more"
      @click.prevent="loadMore"
    >morrr
    </a>
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
      loadMore: 'LOAD_NEXT_PAGE',
      resetNewMissed: 'RESET_NEW_MISSED',
    }),

    openCall(missed) {
      const newNumber = missed.from.number;
      this.openNewCall({ newNumber });
    },
  },
};
</script>

<style lang="scss" scoped>
.missed-queue-container__more {
  display: block;
  text-align: center;
  color: var(--info-color);
}
</style>
