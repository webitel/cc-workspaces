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
    <div class="queue-section-wrapper">
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
      :icon="isNewCallButton ? 'call-ringing' : 'close'"
      color="success"
      rounded
      filled
      size="lg"
      @click="toggleNewCall"
    ></wt-rounded-action>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import sizeMixin from '../../../../app/mixins/sizeMixin';
import WorkspaceStates from '../../../enums/WorkspaceState.enum';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from '../modules/job-queue/components/the-agent-job-queue.vue';

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
  data: () => ({}),
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
  @extend %wt-scrollbar;
  position: relative;
  display: flex;
  overflow: auto;
  flex-direction: column;
  min-width: 0;
  transition: var(--transition);

  gap: var(--spacing-2xs);
  will-change: width;

  &--md {
    flex: 0 0 320px;
  }

  &--sm {
    flex: 0 0 114px;
  }

  .wt-rounded-action {
    position: fixed;
    bottom: var(--spacing-md);
    left: var(--spacing-md);
  }
}

.queue-section-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--spacing-sm);
}

.task-queue {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
