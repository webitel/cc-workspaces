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
      @closed="cacheExpansionState({expansion: value, state: false })"
      @opened="cacheExpansionState({expansion: value, state: true })"
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
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ChatActions, ConversationState } from 'webitel-sdk';

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

const activeChats = computed(() => chatList.value.filter((chat) => chat.state !== ConversationState.Invite));

const expansions = computed(() => [
  {
    value: 'active',
    initiallyCollapsed: restoreExpansionState({ expansion: 'active' }),
    counters: [
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
