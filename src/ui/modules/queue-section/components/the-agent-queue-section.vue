<template>
  <section
    class="workspace-section queue-section"
    :class="[
      `queue-section--${size}`
    ]"
  >

    <div class="queue-section-wrapper">
      <wt-icon-btn
        style="margin-bottom: 5px;"
        v-if="collapsible"
        :icon="collapsed ? 'expand' : 'collapse'"
        size="sm"
        @click="collapsed = !collapsed"
      >{{ collapsed }}
      </wt-icon-btn>
      <call-queue
        :size="size"
      ></call-queue>
      <chat-queue
        :size="size"
      ></chat-queue>
      <job-queue
        :size="size"
      ></job-queue>
    </div>
    <wt-rounded-action
      color="success"
      :icon="isNewCallButton ? 'call-ringing' : 'close'"
      size="lg"
      rounded
      @click="toggleNewCall"
    ></wt-rounded-action>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from '../modules/job-queue/components/the-agent-job-queue.vue';
import WorkspaceStates
  from '../../../enums/WorkspaceState.enum';

export default {
  name: 'the-agent-queue-section',
  components: {
    CallQueue,
    ChatQueue,
    JobQueue,
  },
  data: () => ({
    collapsed: false,
  }),
  computed: {
    ...mapGetters('workspace', {
      workspaceState: 'WORKSRACE_STATE',
    }),
    ...mapGetters('features/call', {
      isNewCall: 'IS_NEW_CALL',
    }),

    isNewCallButton() {
      return !this.isNewCall || !this.isCallWorkspace;
    },

    // used as isNewCallBtn check
    isCallWorkspace() {
      return this.workspaceState === WorkspaceStates.CALL;
    },

    size() {
      if (this.collapsible && this.collapsed) return 'sm';
      if (this.$breakpoint.md) return 'sm';
      if (this.$breakpoint.lg) return 'md';
      return 'md';
    },
    collapsible() {
      return this.$breakpoint.mdAndUp;
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
  },
};
</script>

<style lang="scss" scoped>
.workspace-section.queue-section {
  position: relative;
  display: flex;
  flex-direction: column;
  background: transparent;

  will-change: width;
  transition: var(--transition);

  &--md {
    width: 320px;
  }

  &--sm {
    width: 120px; // TODO make me 72px
  }

  .wt-rounded-action {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
}

.queue-section-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}

.task-queue {
  min-height: 0;
  display: flex;
  flex-direction: column;

  &.call-queue {
    flex: 0 2 auto;
    margin-bottom: 10px;
  }

  &.chat-queue {
    flex: 0 1 auto;
    margin-bottom: 10px;
  }

  &.job-queue {
    flex: 0 0 auto;
  }
}
</style>
