<template>
  <article
    :class="[
      `chat-queue--${size}`
    ]"
    class="task-queue chat-queue wt-scrollbar"
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
          :title="$t(`queueSec.chat.preview.${size}.${value}`)"
          class="task-queue-name"
        >{{ $t(`queueSec.chat.preview.${size}.${value}`) }}</span>
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

      <template #default>
        <component
          :is="getComponent(value)"
          :size="size"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import { computed, ref, onMounted, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { ConversationState } from 'webitel-sdk';
import { AgentChatsAPI } from '@webitel/api-services/api';
import { applyTransform, notify } from '@webitel/api-services/api/transformers'

import { useCachedExpansionState } from '../../_shared/composables/useCachedExpansionState';

//these components have a different appearance than jobs and calls because https://webitel.atlassian.net/browse/WTEL-5273?focusedCommentId=700057
import ActiveQueue from './active-queue/active-queue-container.vue';
import ClosedQueue from './closed-queue/closed-queue-container.vue';
import ManualQueue from './manual-queue/manual-queue-container.vue';

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
} = useCachedExpansionState({ entity: 'chat' });

const chatList = computed(() => store.state.features.chat.chatList);

const closedChat = computed(() => store.state.features.chat.closed.processed.chatsList)

const manualList = computed(() => store.state.features.chat.manual.manualList);

const invitedChats = computed(() => chatList.value.filter((chat) => chat.state === ConversationState.Invite));

const activeChats = computed(() => chatList.value.filter((chat) => chat.state !== ConversationState.Invite))

const allActiveChats = computed(() => invitedChats.value.length + activeChats.value.length)

const counts = ref({
  closed: 0,
});

const { closed: closedCount } = toRefs(counts.value);

const fetchCounts = async () => {
  try {

  // NOTE: If additional counters are added in the future (e.g. onlyUnprocessed, ...),
  // this can be refactored to use Promise.all([...]) and update all values inside counts.
    closedCount.value = await AgentChatsAPI.getChatCount({ onlyClosed: true });
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

// This is to keep track of which tabs are open and which
// are closed, because the expand component doesn't tell you about this
const expansionStates = ref({
  active: restoreExpansionState({ expansion: 'active' }),
  manual: restoreExpansionState({ expansion: 'manual' }),
  closed: restoreExpansionState({ expansion: 'closed' }),
});

// Computed properties to track which chat queue sections are currently expanded
const isActiveExpanded = computed(() => expansionStates.value.active);
const isManualExpanded = computed(() => expansionStates.value.manual);
const isClosedExpanded = computed(() => expansionStates.value.closed);

// Updates expansion state and saves it to localStorage
const handleExpansionChange = (expansion, state) => {
  expansionStates.value[expansion] = state;
  cacheExpansionState({ expansion, state });
};

const expansions = computed(() => [
  {
    value: 'active',
    initiallyCollapsed: restoreExpansionState({ expansion: 'active' }),
    counters: !isActiveExpanded.value ? [
      {
        color: 'secondary',
        count: allActiveChats.value,
      },
      {
        color: 'warning',
        count: activeChats.value.length,
      },
      {
        color: 'success',
        count: invitedChats.value.length,
      },
    ].filter(({ count }) => count) : [],
  },
  {
    value: 'manual',
    initiallyCollapsed: restoreExpansionState({ expansion: 'manual' }),
    counters: [
      {
        color: 'secondary',
        count: manualList.value.length,
      },
    ].filter(({ count }) => count),
  },
  {
    value: 'closed',
    initiallyCollapsed: restoreExpansionState({ expansion: 'closed' }),
    counters: [
      {
        color: 'secondary',
        count: closedCount.value,
      },
    ].filter(({ count }) => count)
  },
]);

const getComponent = (value) => {
  switch (value) {
    case 'active':
      return ActiveQueue;
    case 'manual':
      return ManualQueue;
    case 'closed':
      return ClosedQueue;
    default:
      return null;
  }
};

onMounted(() => {
  fetchCounts();
});

watch(
  [closedChat],
  () => {
    fetchCounts();
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.task-queue-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
