<template>
  <article
    class="task-queue call-queue"
    :class="[
      `call-queue--${size}`
    ]"
  >
    <wt-expansion-panel
      v-for="({ value, initiallyCollapsed, counters }) in expansions"
      :key="value"
      class="task-queue-item"
      :size="size"
      :collapsed="initiallyCollapsed"
      @opened="handleExpansionChange(value, true)"
      @closed="handleExpansionChange(value, false)"
    >
      <template #title>
<!--         title is for tooltip -->
        <span
          class="task-queue-name"
          :title="$t(`queueSec.call.preview.${size}.${value}`)"
        >
          {{ $t(`queueSec.call.preview.${size}.${value}`) }}
        </span>
      </template>
      <template
        v-if="size === 'md'"
        #actions
      >
        <wt-chip
          v-for="({ color, count }, key) in counters"
          :key="key"
          :size="size"
          :color="color"
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
import { computed, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import { useCachedExpansionState } from '../../_shared/composables/useCachedExpansionState';
import isIncomingRinging
  from '../../../../../../features/modules/call/scripts/isIncomingRinging.js';

//TODO: do it similarly as in chats, so that it is not a common component with chats, jobs and calls, because https://webitel.atlassian.net/browse/WTEL-5273?focusedCommentId=700057
import ActiveQueue from './active-queue/active-queue-container.vue';
import ManualQueue from './manual-queue/manual-queue-container.vue';
import MissedQueue from './missed-queue/missed-queue-container.vue';
import OfflineQueue from './offline-queue/offline-queue-container.vue';

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
} = useCachedExpansionState({ entity: 'call' });

const callList = computed(() => store.state.features.call.callList);

const missedList = computed(() => store.state.features.call.missed.missedList);
const missedNext = computed(() => store.state.features.call.missed.next);
const manualList = computed(() => store.state.features.call.manual.manualList);
const membersList = computed(() => store.state.features.member.memberList);

const ringingCallsCount = computed(() => callList.value.filter((call) => isIncomingRinging(call)).length);
const activeCallsCount = computed(() => callList.value.length - ringingCallsCount.value);
const allActiveCalls = computed(() => activeCallsCount.value + ringingCallsCount.value);

// This is to keep track of which tabs are open and which
// are closed, because the expand component doesn't tell you about this
const expansionStates = ref({
  active: restoreExpansionState({ expansion: 'active' }),
  missed: restoreExpansionState({ expansion: 'missed' }),
  offline: restoreExpansionState({ expansion: 'offline' }),
  manual: restoreExpansionState({ expansion: 'manual' }),
});

// Computed properties to track which chat queue sections are currently expanded
const isActiveExpanded = computed(() => expansionStates.value.active);
const isMissedExpanded = computed(() => expansionStates.value.missed);
const isOfflineExpanded = computed(() => expansionStates.value.offline);
const isManualExpanded = computed(() => expansionStates.value.manual);

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
        count: !isActiveExpanded.value ? allActiveCalls.value : 0,
      },
      { color: 'main', count: activeCallsCount.value },
      { color: 'success', count: ringingCallsCount.value },
    ].filter(({ count }) => count),
  },
  {
    value: 'missed',
    initiallyCollapsed: restoreExpansionState({ expansion: 'missed' }),
    counters: [
      { color: 'secondary', count: missedNext.value ? `${missedList.value.length}+` : missedList.value.length },
    ].filter(({ count }) => count),
  },
  {
    value: 'offline',
    initiallyCollapsed: restoreExpansionState({ expansion: 'offline' }),
    counters: [
      { color: 'secondary', count: membersList.value.length },
    ].filter(({ count }) => count),
  },
  {
    value: 'manual',
    initiallyCollapsed: restoreExpansionState({ expansion: 'manual' }),
    counters: [
      { color: 'secondary', count: manualList.value.length },
    ].filter(({ count }) => count),
  },
]);

const getComponent = (value) => {
  switch (value) {
    case 'active':
      return ActiveQueue;
    case 'missed':
      return MissedQueue;
    case 'offline':
      return OfflineQueue;
    case 'manual':
      return ManualQueue;
    default:
      return null;
  }
};

function openNewCall(payload) {
  return store.dispatch('features/call/OPEN_NEW_CALL', payload);
}
</script>

<style lang="scss">
.task-queue-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
