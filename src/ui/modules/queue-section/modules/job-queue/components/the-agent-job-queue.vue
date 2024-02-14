<template>
  <article
    :class="[
      `job-queue--${size}`
    ]"
    class="task-queue job-queue"
  >
    <wt-expansion-panel
      v-for="({ value, initiallyCollapsed, counters }) in expansions"
      :key="value"
      :size="size"
      :collapsed="initiallyCollapsed[value]"
      @opened="cacheExpansionState({expansion: value, state: true })"
      @closed="cacheExpansionState({expansion: value, state: false })"
    >
      <template v-slot:title>
        {{ $t(`queueSec.job.preview.${size}.${value}`) }}
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
          :is="getComponent(value)"
          :size="size"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import { useStore } from 'vuex';
import { JobState } from 'webitel-sdk';
import { useCachedExpansionState } from '../../_shared/composables/useCachedExpansionState';
import ActiveQueue from './active/job-queue-container.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const {
  cacheExpansionState,
  restoreExpansionState,
} = useCachedExpansionState({ entity: 'job' });

const taskList = computed(() => store.state.features.job.jobList);

const distributedTasks = computed(() => taskList.value.filter((task) => task.state === JobState.Distribute));
const activeTasks = computed(() => taskList.value.filter((task) => task.state !== JobState.Distribute));

const expansions = computed(() => [
  {
    value: 'active',
    initiallyCollapsed: restoreExpansionState('active'),
    counters: [
      {
        color: 'main',
        count: activeTasks.value.length,
      },
      {
        color: 'success',
        count: distributedTasks.value.length,
      },
    ].filter(({ count }) => count),
  },
]);

const getComponent = (value) => {
  switch (value) {
    case 'active':
      return ActiveQueue;
    default:
      return null;
  }
};
</script>

<style lang="scss" scoped>
</style>
