<template>
  <section class="workspace-section queue-section">
    <div class="queue-section-wrapper">
      <call-queue/>
      <chat-queue/>
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
import { mapGetters, mapActions, mapState } from 'vuex';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import WorkspaceStates
  from '../../../store/workspaceUtils/WorkspaceStates';

export default {
  name: 'the-agent-queue-section',
  components: {
    CallQueue,
    ChatQueue,
  },

  computed: {
    ...mapState('workspace', {
      workspaceState: (state) => state.workspaceState,
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

.call-queue {
  flex: 0 2 auto;
  margin-bottom: 10px;
}

.chat-queue {
  flex: 2 1 auto;
}
</style>
