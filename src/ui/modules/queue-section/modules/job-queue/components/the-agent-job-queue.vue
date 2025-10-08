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
      class="task-queue-item"
      :collapsed="initiallyCollapsed"
      :size="size"
      @closed="handleExpansionChange(value, false)"
      @opened="handleExpansionChange(value, true)"
    >
      <template #title>
        <span
          :title="$t(`queueSec.job.preview.${size}.${value}`)"
          class="task-queue-name"
        >
          {{ $t(`queueSec.job.preview.${size}.${value}`) }}
        </span>
      </template>
      <template
        v-if="size === 'md'"
        #actions
      >
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
import { computed, ref } from 'vue';
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

const distributedTasks = computed(() => taskList.value.filter((task) => task.state === JobState.Offering));
const activeTasks = computed(() => taskList.value.filter((task) => task.state !== JobState.Offering));
const allActiveTasks = computed(() => activeTasks.value.length + distributedTasks.value.length);

// This is to keep track of which tabs are open and which
// are closed, because the expand component doesn't tell you about this
const expansionStates = ref({
  active: restoreExpansionState({ expansion: 'active' }),
});

// Computed properties to track which chat queue sections are currently expanded
const isActiveExpanded = computed(() => expansionStates.value.active);

// Updates expansion state and saves it to localStorage
const handleExpansionChange = (expansion, state) => {
  expansionStates.value[expansion] = state;
  cacheExpansionState({ expansion, state });
};

const expansions = computed(() => [
  {
    value: 'active',
    initiallyCollapsed: restoreExpansionState({ expansion: 'active' }),
    counters: [
      {
        color: 'secondary',
        count: !isActiveExpanded.value ? allActiveTasks.value : 0,
      },
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
.task-queue-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
