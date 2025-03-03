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
    ></collapse-action>
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      class="queue-section-tabs"
      @change="currentTab = $event"
    >
      <template
        v-for="(tab, key) of tabs"
        :key="key"
        v-slot:[tab.value]
      >
        <div class="queue-section-tab-wrapper">
          <wt-badge
            v-show="tab.value !== currentTab.value && tab.showIndicator"
            :color-variable="`${tab.iconColor}-color`"
          ></wt-badge>
          <wt-icon
            :color="tab.iconColor"
            :icon="tab.icon"
            :size="size"
          ></wt-icon>
        </div>
      </template>
    </wt-tabs>
    <component
      :is="`${currentTab.value}-queue`"
      :size="size"
      class="queue-section-wrapper"
    ></component>
    <wt-rounded-action
      :icon="isNewCallButton ? 'call-ringing' : 'close'"
      color="success"
      rounded
      size="lg"
      @click="toggleNewCall"
    ></wt-rounded-action>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';
import CollapseAction from '../../../app/components/utils/collapse-action.vue';
import sizeMixin from '../../../app/mixins/sizeMixin.js';
import WorkspaceStates from '../../../features/enums/WorkspaceState.enum.js';
import CallQueue from './modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from './modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from './modules/job-queue/components/the-agent-job-queue.vue';
import HotkeyAction from '../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../hotkeys/useHotkeys.js';

export default {
  name: 'the-agent-queue-section',
  mixins: [sizeMixin],
  components: {
    CallQueue,
    ChatQueue,
    JobQueue,
    CollapseAction,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    currentTab: {},
    hotkeyUnsubscribers : [],
  }),
  computed: {
    ...mapState('features/call', {
      callList: (state) => state.callList,
    }),
    ...mapState('features/call/manual', {
      manualCallsList: (state) => state.manualList,
    }),
    ...mapState('features/chat', {
      chatList: (state) => state.chatList,
    }),
    ...mapState('features/chat/manual', {
      manualChatList: (state) => state.manualList,
    }),
    ...mapState('features/job', {
      jobList: (state) => state.jobList,
    }),
    ...mapGetters('workspace', {
      isCallWorkspace: 'IS_CALL_WORKSPACE',
    }),
    ...mapGetters('features/call', {
      isNewCall: 'IS_NEW_CALL',
    }),
    tabs() {
      return [
        {
          value: 'call',
          icon: 'call',
          iconColor: 'success',
          showIndicator: this.callList.some(({ state }) => state === CallActions.Ringing) || this.manualCallsList.length,
        },
        {
          value: 'chat',
          icon: 'chat',
          iconColor: 'chat',
          showIndicator: this.chatList.some(({ state }) => state === ConversationState.Invite) || this.manualChatList.length,
        },
        {
          value: 'job',
          icon: 'job',
          iconColor: 'job',
          showIndicator: this.jobList.some(({ state }) => state === JobState.Distribute || state === JobState.Offering),
        },
      ];
    },
    isNewCallButton() {
      return !this.isNewCall || !this.isCallWorkspace;
    },
  },

  methods: {
    ...mapActions('features/call', {
      openNewCall: 'OPEN_NEW_CALL',
      closeNewCall: 'CLOSE_NEW_CALL',
    }),
    toggleNewCall() {
      return this.isNewCallButton ? this.openNewCall() : this.closeNewCall();
    },
    setupHotkeys() {
      const subscripers = [
        {
          event: HotkeyAction.NEW_CALL,
          callback: this.toggleNewCall,
        },
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscripers);
    },
  },

  created() {
    this.currentTab = this.tabs[0];
  },

  mounted() {
    this.setupHotkeys();
  },

  unmounted() {
    this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
  },
};
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

    :deep .wt-icon__icon {
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

.queue-section-tab-wrapper {
  position: relative;
}

.queue-section-wrapper {
  flex-grow: 1;
}
</style>
