<template>
  <the-agent-task-queue
    class="task-queue chat-queue"
    :size="size"
    :title="$t('queueSec.chat.chats')"
  >
    <template v-slot:title>
      <div class="call-queue__title-wrapper">
        <span class="call-queue__title">{{ $t('queueSec.chat.chats') }}</span>
        <wt-tabs
          v-model="currentTab"
          :tabs="tabs"
        >
          <template
            v-for="(tab, key) of tabs"
            v-slot:[tab.value]
          >
            <div class="queue-tab__wrap" :key="key">
              <div
                v-show="tab.attention"
                class="queue-tab__indicator"
                :class="tab.value"
              ></div>
              <wt-icon
                :icon="tab.icon"
                :color="tab.iconColor"
                :size="size"
              ></wt-icon>
            </div>
          </template>
        </wt-tabs>
      </div>
    </template>
    <component
      :is="currentTabComponent"
      :size="size"
    ></component>
  </the-agent-task-queue>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import TheAgentTaskQueue from '../../_shared/components/the-agent-task-queue.vue';
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

const tabs = computed(() => [
  {
    value: 'active',
    icon: 'chat',
    iconColor: 'transfer',
    attention: chatList.value.length,
  },
  {
    value: 'manual',
    icon: 'chat-join',
    iconColor: 'transfer',
    attention: manualList.value.length,
  },
]);

const currentTab = ref(tabs.value[0]);

const currentTabComponent = computed(() => {
  switch (currentTab.value.value) {
    case 'active':
      return ActiveQueue;
    case 'manual':
      return ManualQueue;
    default:
      return ActiveQueue;
  }
});
</script>

<style lang="scss" scoped>
.chat-queue {
  .call-queue__title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &--sm {
    .call-queue__title-wrapper {
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
}


.wt-tabs {
  width: fit-content;

  .queue-tab__wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .queue-tab__indicator {
    position: absolute;
    top: 0;
    right: -3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;

    &.active {
      background: var(--transfer-color);
    }

    &.manual {
      background: var(--transfer-color);
    }
  }
}
</style>
