<template>
  <section
    class="workspace-section work-section"
    :class="[
      `work-section--${size}`
    ]"
  >
    <wt-icon-btn
      style="position:absolute; left: 5px; top: 5px; z-index: 1;"
      v-if="collapsible"
      :icon="collapsed ? 'expand' : 'collapse'"
      size="sm"
      @click="$emit('resize')"
    >{{ collapsed }}
    </wt-icon-btn>
    <component :is="workspaceComponent"/>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
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
  will-change: width;
  transition: var(--transition);

  &--md {
    flex: 1 1 auto;
  }
  &--sm {
    flex: 0 0 400px;
  }
}
</style>
