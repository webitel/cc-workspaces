<template>
  <section class="workspace-section">
    <component :is="workspaceComponent"/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import WorkspaceStates
  from '../../../store/workspaceUtils/WorkspaceStates';
import Call from '../modules/call/components/the-call.vue';
import Chat from '../modules/chat/components/the-chat.vue';
import Member from '../modules/member/the-member.vue';
import EmptyWorkspace from '../modules/empty-workspace/components/empty-workspace-empty.vue';

export default {
  name: 'the-agent-workspace-section',
  components: {
    Call,
    Chat,
    Member,
    EmptyWorkspace,
  },

  computed: {
    ...mapState('workspace', {
      state: (state) => state.workspaceState,
    }),
    workspaceComponent() {
      switch (this.state) {
        case WorkspaceStates.CALL:
          return 'call';
        case WorkspaceStates.CHAT:
          return 'chat';
        case WorkspaceStates.MEMBER:
          return 'member';
        default:
          return 'empty-workspace';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.workspace-section {
  //padding: var(--spacing-sm);
}
</style>
