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
      @opened="cacheExpansionState({expansion: value, state: true })"
      @closed="cacheExpansionState({expansion: value, state: false })"
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
import { computed, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import { useCachedExpansionState } from '../../_shared/composables/useCachedExpansionState';
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

const ringingCallsCount = computed(() => callList.value.filter((call) => call.state === CallActions.Ringing).length);
const activeCallsCount = computed(() => callList.value.length - ringingCallsCount.value);

const expansions = computed(() => [
  {
    value: 'active',
    initiallyCollapsed: restoreExpansionState({ expansion: 'active' }),
    counters: [
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
