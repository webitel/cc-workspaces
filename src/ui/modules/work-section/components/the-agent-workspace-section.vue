<template>
  <section
    class="workspace-section work-section"
    :class="[
      `work-section--${size}`
    ]"
  >
    <div class="workspace-section__collapse-actions">
      <collapse-action
        v-if="collapsible"
        :collapsed="collapsed"
        @click="$emit('resize')"
      ></collapse-action>
    </div>
    <component
      class="work-section__main-content"
      :is="workspaceComponent"
      :size="size"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import sizeMixin from '../../../../app/mixins/sizeMixin';
import WorkspaceStates
  from '../../../enums/WorkspaceState.enum';
import Call from '../modules/call/components/the-call.vue';
import Chat from '../modules/chat/components/the-chat.vue';
import Member from '../modules/member/components/the-member.vue';
import Job from '../modules/job/components/the-job.vue';
import EmptyWorkspace from '../modules/empty-workspace/components/empty-workspace-empty.vue';

export default {
  name: 'the-agent-workspace-section',
  components: {
    Call,
    Chat,
    Member,
    Job,
    EmptyWorkspace,
    CollapseAction,
  },
  mixins: [sizeMixin],
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

  computed: {
    ...mapGetters('workspace', {
      state: 'WORKSRACE_STATE',
    }),
    workspaceComponent() {
      switch (this.state) {
        case WorkspaceStates.CALL:
          return 'call';
        case WorkspaceStates.CHAT:
          return 'chat';
        case WorkspaceStates.MEMBER:
          return 'member';
        case WorkspaceStates.JOB:
          return 'job';
        default:
          return 'empty-workspace';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.work-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
  will-change: width;
  gap: var(--spacing-2xs);
  transition: var(--transition);

  &--md {
    /* should be bigger than info-section 1 1 320px cause info section should */
    flex: 100 100 auto;
  }
  &--sm {
    flex: 0 0 400px;
  }
}

.workspace-section__collapse-actions {
  line-height: 0;
}

.work-section__main-content {
  flex-grow: 1;
  min-height: 0;
}
</style>
