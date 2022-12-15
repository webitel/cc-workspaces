<template>
  <section
    class="workspace-section queue-section"
    :class="[
      `queue-section--${size}`
    ]"
  >

    <div class="queue-section-wrapper">
      <div class="workspace-section__collapse-actions">
        <collapse-action
          v-if="collapsible"
          :collapsed="collapsed"
          @click="$emit('resize')"
        ></collapse-action>
      </div>
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
import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import sizeMixin from '../../../../app/mixins/sizeMixin';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from '../modules/job-queue/components/the-agent-job-queue.vue';
import WorkspaceStates from '../../../enums/WorkspaceState.enum';

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
  min-width: 0;

  will-change: width;
  transition: var(--transition);

  &--md {
    flex: 0 0 320px;
  }

  &--sm {
    flex: 0 0 120px; // TODO make me 72px
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

.workspace-section__collapse-actions {
  padding: var(--spacing-sm);
  background: var(--main-color);
  margin-bottom: 10px;
  border-radius: var(--border-radius);
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
