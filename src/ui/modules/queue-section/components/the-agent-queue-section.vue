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
      class="queue-section-tabs"
      @change="currentTab = $event"
    >
      <template
        v-for="(tab, key) of tabs"
        :key="key"
        #[tab.value]
      >
        <div
          class="queue-section-tab-wrapper"
          :class="{ 'queue-section-tab-wrapper--small': collapsed }"
        >
          <span class="chip-box">
            <!-- TODO: Replace with Badge component when it's refactored to primeVue and use same style for this chips-->
            <wt-chip
              v-if="tab.count && tab.isNew"
              color="success"
              class="queue-section-chip queue-section-chip--success"
            >
              {{ tab.count }}
            </wt-chip>
          </span>
          <wt-icon :color="tab.iconColor" :icon="tab.icon" :size="size" />

          <span class="chip-box">
            <!-- TODO: Replace with Badge component when it's refactored to primeVue and use same style for this chips-->
            <wt-chip
              v-if="tab.count && !tab.isNew"
              color="primary"
              class="queue-section-chip queue-section-chip--primary"
            >
              {{ tab.count }}
            </wt-chip>
          </span>
        </div>

      </template>
    </wt-tabs>
    <keep-alive>
      <component
        :is="currentTab.component"
        :size="size"
        class="queue-section-wrapper"
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';

import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import HotkeyAction from '../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../hotkeys/useHotkeys';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from '../modules/job-queue/components/the-agent-job-queue.vue';

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
    type: String,
    default: 'md',
  },
});

const emit = defineEmits(['resize']);

const store = useStore();
const currentTab = ref({});
const hotkeyUnsubscribers = ref([]);

const callList = computed(() => store.state.features?.call?.callList || []);
const manualCallsList = computed(() => store.state.features?.call?.manual?.manualList || []);
const chatList = computed(() => store.state.features?.chat?.chatList || []);
const manualChatList = computed(() => store.state.features?.chat?.manual?.manualList || []);
const jobList = computed(() => store.state.features?.job?.jobList || []);

const isCallWorkspace = computed(() => store.getters['workspace/IS_CALL_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const tabs = computed(() => {

  const callCount = window.cli ? cli?.allCall?.()?.length : 0;
  const chatCount = window.cli ? cli?.allConversations?.()?.length : 0;
  const jobCount = window.cli ? cli?.allJob?.()?.length : 0;


  return [
    {
      value: 'call',
      icon: 'call',
      iconColor: 'success',
      count: callCount,
      component: CallQueue,
      isNew: callList?.value.some(({ state }) => state === CallActions.Ringing) || manualCallsList.value.length,
    },
    {
      value: 'chat',
      icon: 'chat',
      iconColor: 'chat',
      count: chatCount,
      component: ChatQueue,
      isNew: chatList?.value.some(({ state }) => state === ConversationState.Invite) || manualChatList.value.length,
    },
    {
      value: 'job',
      icon: 'job',
      iconColor: 'job',
      count: jobCount,
      component: JobQueue,
      isNew: jobList?.value.some(({ state }) => state === JobState.Distribute || state === JobState.Offering),
    }
  ]
});

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
  }

  &--sm {
    flex: 0 0 132px;
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
.queue-section-tabs.wt-tabs {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
}

$chip-w: 30px;
$chip-h: 24px;

.queue-section-tab-wrapper {
  display: grid;
  align-items: center;
  justify-items: center;

  grid-template-columns: $chip-w auto $chip-w;

  &--small {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2xs);

    .chip-box {
      order: -1;
    }
  }
}

.chip-box {
  width: $chip-w;
  height: $chip-h;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.queue-section-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: $chip-w;
  height: $chip-h;
}


.queue-section-wrapper {
  flex-grow: 1;
}
</style>
