<template>
  <article
    class="task-queue chat-queue"
    :class="[
      `chat-queue--${size}`
    ]"
  >
    <wt-expansion-panel
      v-for="({ value, counters }) in expansions"
      :size="size"
      :key="value"
    >
      <template v-slot:title>
        {{ `${$t(`queueSec.chat.${value}`)} ${$t('queueSec.chat.chats', 2).toLowerCase()}` }}
      </template>
      <template v-slot:actions>
        <wt-chip
          v-for="({ color, count }, key) in counters"
          :size="size"
          :color="color"
          :key="key"
        >{{ count }}
        </wt-chip>
      </template>
      <template>
        <component
          :size="size"
          :is="getComponent(value)"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ChatActions } from 'webitel-sdk';
import ActiveQueue from './active-queue/active-queue-container.vue';
import ManualQueue from './manual-queue/manual-queue-container.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const chatList = computed(() => store.state.features.chat.chatList);
const manualList = computed(() => store.state.features.chat.manual.manualList);

const invitedChats = computed(() => chatList.value.filter((chat) => chat.state === ChatActions.UserInvite));

const activeChats = computed(() => chatList.value.filter((chat) => chat.state !== ChatActions.UserInvite));

const expansions = computed(() => [
  {
    value: 'active',
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
    counters: [
      {
        color: 'secondary',
        count: manualList.value.length,
      },
    ].filter(({ count }) => count),
  },
]);

const getComponent = (value) => {
  switch (value) {
    case 'active':
      return ActiveQueue;
    case 'manual':
      return ManualQueue;
    default:
      return null;
  }
};
</script>

<style lang="scss" scoped>

</style>
