<template>
  <article
    :class="[
      `job-queue--${size}`
    ]"
    class="task-queue job-queue"
  >
    <wt-expansion-panel
      v-for="({ value, counters }) in expansions"
      :key="value"
      :size="size"
    >
      <template v-slot:title>
        {{ `${$t(`queueSec.chat.${value}`)} ${$t('queueSec.chat.chats', 2).toLowerCase()}` }}
      </template>
      <template v-slot:actions>
        <wt-chip
          v-for="({ color, count }, key) in counters"
          :key="key"
          :color="color"
          :size="size"
        >{{ count }}
        </wt-chip>
      </template>
      <template>
        <component
          :is="`${value}-queue`"
          :size="size"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { JobState } from 'webitel-sdk';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import JobQueue from './active/job-queue-container.vue';

export default {
  name: 'the-agent-job-queue',
  components: {
    JobQueue,
  },
  mixins: [sizeMixin],
  computed: {
    ...mapState('features/job', {
      taskList: (state) => state.jobList,
    }),
    distributedTasks() {
      return this.taskList.filter((task) => task.state === JobState.Distribute);
    },
    activeTasks() {
      return this.taskList.filter((task) => task.state !== JobState.Distribute);
    },
    expansions() {
      return [
        {
          value: 'job',
          counters: [
            {
              color: 'main',
              count: this.activeTasks.length,
            },
            {
              color: 'success',
              count: this.distributedTasks.length,
            },
          ].filter(({ count }) => count),
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
