<template>
  <task-queue-container
    :empty="!missedList.length"
  >
    <missed-preview
      v-for="(task, key) of missedList"
      :key="task.id"
      :task="task"
      :index="key"
      :size="size"
      @hide="hideMissed(task)"
      @call="redial(task)"
    ></missed-preview>
    <a
      class="missed-queue-container__more"
      v-show="next"
      @click.prevent="loadMore"
    >{{ $t('reusable.more') }}
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

  computed: {
    ...mapState('features/call/missed', {
      missedList: (state) => state.missedList,
      next: (state) => state.next,
    }),
  },

  methods: {
    ...mapActions('features/call/missed', {
      loadMissedList: 'LOAD_DATA_LIST',
      loadMore: 'LOAD_NEXT_PAGE',
      redial: 'REDIAL',
      hideMissed: 'HIDE_MISSED',
      resetNewMissed: 'RESET_NEW_MISSED',
      resetMissed: 'RESET_MISSED_LIST',
    }),
  },

  created() {
    this.loadMissedList();
    this.resetNewMissed(); // reset UI flag
  },

  unmounted() {
    this.resetMissed();
  },
};
</script>

<style lang="scss" scoped>
.missed-queue-container__more {
  display: block;
  text-align: center;
  color: var(--info-color);
  cursor: pointer;
}
</style>
