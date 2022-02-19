<template>
  <section class="workspace-section">
    <component :is="workspaceComponent"/>
    <chat></chat>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import WorkspaceStates
  from '../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';
import Call from './call/the-call.vue';
import Chat from './chat/the-chat.vue';
import Member from './member/the-member.vue';
import EmptyWorkspace from './empty-workspace/empty-workspace-empty.vue';

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
</style>
