<template>
  <article
    :class="[
      `chat-queue--${size}`
    ]"
    class="task-queue chat-queue"
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ConversationState } from 'webitel-sdk';

import { useCachedExpansionState } from '../../_shared/composables/useCachedExpansionState';
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

const expansionStates = ref({
  active: restoreExpansionState({ expansion: 'active' }),
  manual: restoreExpansionState({ expansion: 'manual' }),
  closed: restoreExpansionState({ expansion: 'closed' }),
});

const isActiveExpanded = computed(() => expansionStates.value.active);
const isManualExpanded = computed(() => expansionStates.value.manual);
const isClosedExpanded = computed(() => expansionStates.value.closed);

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
        count: !isActiveExpanded.value ? allActiveChats.value : 0,
      },
      {
        color: 'main',
        count: activeChats.value.length,
      },
      {
        color: 'success',
        count: invitedChats.value.length,
      },
    ].filter(({ count }) => count),
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
        count: closedChat.value.length,
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

</script>

<style lang="scss" scoped>
.task-queue-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
