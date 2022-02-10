<template>
  <section class="workspace-section queue-section">
    <div class="queue-section-wrapper">
      <call-queue/>
      <chat-queue/>
    </div>
    <wt-rounded-action
      v-show="isNewCallButton"
      color="success"
      icon="call-ringing"
      size="lg"
      rounded
      @click="openNewCall"
    ></wt-rounded-action>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import CallQueue from './call-queue/the-agent-call-queue.vue';
import ChatQueue from './chat-queue/the-agent-chat-queue.vue';
import WorkspaceStates
  from '../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

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
    ...mapGetters('call', {
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
    ...mapActions('call', {
      openNewCall: 'OPEN_NEW_CALL',
    }),
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
