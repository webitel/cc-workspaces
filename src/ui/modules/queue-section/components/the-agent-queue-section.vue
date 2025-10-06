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
          class="queue-section-tab-content"
          :class="{ 'queue-section-tab-content--small': size === ComponentSize.MD }"
        >
          <span class="count-indicator">
            <!-- TODO: Replace with Badge component when it's refactored to primeVue and use same style for this chips-->
            <wt-chip
              v-if="tab.count && tab.hasIncoming"
              color="success"
              class="count count--incoming"
            >
              {{ tab.count }}
            </wt-chip>
          </span>
          <wt-icon :color="tab.iconColor" :icon="tab.icon" :size="size" />

          <span class="count-indicator">
            <!-- TODO: Replace with Badge component when it's refactored to primeVue and use same style for this chips-->
            <wt-chip
              v-if="tab.count && !tab.hasIncoming"
              color="primary"
              class="count count--active"
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
import { ComponentSize } from '@webitel/ui-sdk/enums';

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
    type: ComponentSize,
    default: ComponentSize.MD,
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
      hasIncoming: callList?.value.some(({ state }) => state === CallActions.Ringing) || manualCallsList.value.length,
    },
    {
      value: 'chat',
      icon: 'chat',
      iconColor: 'chat',
      count: chatCount,
      component: ChatQueue,
      hasIncoming: chatList?.value.some(({ state }) => state === ConversationState.Invite) || manualChatList.value.length,
    },
    {
      value: 'job',
      icon: 'job',
      iconColor: 'job',
      count: jobCount,
      component: JobQueue,
      hasIncoming: jobList?.value.some(({ state }) => state === JobState.Distribute || state === JobState.Offering),
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

  //&--md {
  //  flex: 0 0 320px;
  //}
  //
  //&--sm {
  //  flex: 0 0 132px;
  //}

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

//TODO value for count indicator, which should be different
// after adding badge with primevue, need delete this
$indicator-w: 30px;
$indicator-h: 24px;

.queue-section-tab-content {
  display: grid;
  align-items: center;
  justify-items: center;

  //TODO after adding badge with primevue, need delete this
  grid-template-columns: $indicator-w auto $indicator-w;

  &--small {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2xs);

    .count-indicator {
      order: -1;
    }
  }
}

.count-indicator {
  //TODO after adding badge with primevue, need delete this
  width: $indicator-w;
  height: $indicator-h;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.count {
  display: flex;
  align-items: center;
  justify-content: center;
  //TODO after adding badge with primevue, need delete this
  min-width: $indicator-w;
  height: $indicator-h;
}


.queue-section-wrapper {
  flex-grow: 1;
}
</style>
