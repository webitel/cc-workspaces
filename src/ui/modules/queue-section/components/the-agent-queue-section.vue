<template>
  <section
    :class="[
      `queue-section--${size}`
    ]"
    class="workspace-section queue-section"
  >
    <collapse-action
      v-if="collapsible"
      :collapsed="collapsed"
      @click="$emit('resize')"
    />
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      class="queue-section__tabs"
      @change="currentTab = $event"
    >
      <template
        v-for="(tab, key) of tabs"
        :key="key"
        #[tab.value]
      >
        <div
          class="queue-section__tab-content"
          :class="{ 'queue-section__tab-content--sm': size === ComponentSize.SM }"
        >
          <div class="queue-section_indicator">
            <wt-icon :color="tab.iconColor" :icon="tab.icon" :size="size" />
            <wt-badge
              v-if="tab.showIndicator"
              color-variable="error-color"
            />
          </div>
          <!-- TODO: Replace with Badge component when it's refactored to primeVue and use same style for this chips-->
          <wt-chip
            v-if="tab.countActive"
            color="warning"
            class="queue-section__count queue-section__count--active"
          >
            {{ tab.countActive }}
          </wt-chip>
        </div>

      </template>
    </wt-tabs>
    <keep-alive>
      <component
        :is="currentTab.component"
        :size="size"
        class="queue-section__wrapper"
      />
    </keep-alive>
    <wt-rounded-action
      :icon="isNewCallButton ? 'call-ringing' : 'close'"
      color="success"
      rounded
      size="lg"
      @click="toggleNewCall"
    />
  </section>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';
import { ComponentSize } from '@webitel/ui-sdk/enums';

import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import HotkeyAction from '../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../hotkeys/useHotkeys';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from '../modules/job-queue/components/the-agent-job-queue.vue';
import isIncomingRinging from '../../../../features/modules/call/scripts/isIncomingRinging.js';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  size: {
    type: ComponentSize,
    default: ComponentSize.MD,
  },
});

const emit = defineEmits(['resize']);

const store = useStore();
const currentTab = ref({});
const hotkeyUnsubscribers = ref([]);
const chatMessagesLengthMap = ref({});
const hasNewChatMessages = ref(false);

const callList = computed(() => store.state.features?.call?.callList || []);
const manualCallsList = computed(() => store.state.features?.call?.manual?.manualList || []);
const chatList = computed(() => store.state.features?.chat?.chatList || []);
const manualChatList = computed(() => store.state.features?.chat?.manual?.manualList || []);
const jobList = computed(() => store.state.features?.job?.jobList || []);

const isCallWorkspace = computed(() => store.getters['workspace/IS_CALL_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const isActiveCall = (call) => {
  const isActiveState = [CallActions.Active, CallActions.Hold].includes(call.state);
  const isOutgoingRinging = call.state === CallActions.Ringing && !isIncomingRinging(call);
  return isActiveState || isOutgoingRinging;
};
const getCountByStates = (list = [], states = []) =>
  list.filter((item) => states.includes(item.state)).length;

const activeCallCount = computed(() => callList.value.filter(isActiveCall).length);
const incomingCallCount = computed(
  () => callList.value.filter(isIncomingRinging).length + manualCallsList.value?.length,
);

const activeChatCount = computed(() => getCountByStates(chatList.value, [ConversationState.Active]));
const incomingChatCount = computed(
  () => getCountByStates(chatList.value, [ConversationState.Invite]) + manualChatList.value?.length,
);

const activeJobCount = computed(() =>
  getCountByStates(jobList.value, [JobState.Bridged, JobState.Processing]),
);
const incomingJobCount = computed(() =>
  getCountByStates(jobList.value, [JobState.Distribute, JobState.Offering]),
);

const activeChatId = computed(
  () => store.getters['features/chat/CHAT_ON_WORKSPACE']?.id,
);

const getChatMessagesLength = (chat) =>
  chat.messages?.length ?? 0;

const tabs = computed(() => [
  {
    value: 'call',
    icon: 'call',
    iconColor: 'success',
    countActive: activeCallCount.value,
    component: CallQueue,
    showIndicator: !!incomingCallCount.value,
  },
  {
    value: 'chat',
    icon: 'chat',
    iconColor: 'chat',
    countActive: activeChatCount.value,
    component: ChatQueue,
    showIndicator: !!incomingChatCount.value || hasNewChatMessages.value,
  },
  {
    value: 'job',
    icon: 'job',
    iconColor: 'job',
    countActive: activeJobCount.value,
    component: JobQueue,
    showIndicator: !!incomingJobCount.value,
  },
]);

const isNewCallButton = computed(() => !isNewCall.value || !isCallWorkspace.value);

const openNewCall = () => store.dispatch('features/call/OPEN_NEW_CALL');
const closeNewCall = () => store.dispatch('features/call/CLOSE_NEW_CALL');

const toggleNewCall = () => isNewCallButton.value ? openNewCall() : closeNewCall();

const setupHotkeys = () => {
  const subscribers = [
    {
      event: HotkeyAction.NEW_CALL,
      callback: toggleNewCall,
    },
  ];
  hotkeyUnsubscribers.value = useHotkeys(subscribers);
};

onMounted(() => {
  currentTab.value = tabs.value[0];
  setupHotkeys();
});

onUnmounted(() => {
  hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
});

//@author Oles Chorpita
// Watch for changes in the chat list or the currently opened chat
//https://webitel.atlassian.net/browse/WTEL-8123
watch(
  [chatList, activeChatId],
  ([chats = [], currentActiveId]) => {
    hasNewChatMessages.value = false;
    chats.forEach((chat) => {
      const id = chat.id;
      const messageLength = getChatMessagesLength(chat);

      if (chatMessagesLengthMap.value[id] == null || id === currentActiveId) {
        // Initialize counter the first time we see this chat
        chatMessagesLengthMap.value[id] = messageLength;
        // When user opens a chat — mark it as read
        if (id === currentActiveId) return;
      }

      const prevLength = chatMessagesLengthMap.value[id];

      // Detect new messages for non-active chats
      if (messageLength > prevLength) {
        return hasNewChatMessages.value = true;
      }
    });
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>
<style lang="scss" scoped>
.workspace-section.queue-section {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: var(--transition);

  gap: var(--spacing-2xs);
  will-change: width;

  &--md {
    flex: 0 0 320px;
    max-width: 320px;
  }

  &--sm {
    flex: 0 0 132px;
    max-width: 132px;
  }

  .wt-rounded-action {
    position: fixed;
    bottom: var(--spacing-md);
    left: var(--spacing-md);
    border-color: var(--success-color);
    background: var(--success-color);
    z-index: var(--ws-main-call-button-z-index);

    :deep .wt-icon {
      fill: var(--icon-on-dark-color);
    }
  }
}

// increase specificity
.queue-section__tabs.wt-tabs {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
}

//TODO value for count indicator, which should be different
// after adding badge with primevue, need delete this
$indicator-width: 34px;
$indicator-height: 16px;

.queue-section__tab-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  justify-content: center;

  &--sm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    gap: var(--spacing-2xs);
    height: 100%;


    .queue-section__count {
      order: -1;
    }
  }
}

.queue-section__count {
  display: flex;
  align-items: center;
  justify-content: center;
  //TODO after adding badge with primevue, need delete this
  min-width: $indicator-width;
  height: $indicator-height;
}

.queue-section__wrapper {
  flex-grow: 1;
}

.queue-section_indicator {
  display: flex;
  position: relative;
}
</style>
