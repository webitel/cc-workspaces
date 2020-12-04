<template>
  <section class="workspace-section">
    <component :is="workspaceComponent"/>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import WorkspaceStates
    from '../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';
  import Call from './call/the-call.vue';
  import Member from './member/the-member.vue';
  import EmptyWorkspace from './empty-workspace/empty-workspace-empty.vue';

  export default {
    name: 'the-agent-workspace-section',
    components: {
      Call,
      Member,
      EmptyWorkspace,
    },

    computed: {
      ...mapState('workspace', {
        state: (state) => state.workspaceState,
      }),

      workspaceComponent() {
        switch (this.state) {
          case WorkspaceStates.CALL: return 'call';
          case WorkspaceStates.MEMBER: return 'member';
          default: return 'empty-workspace';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chat {
    height: 100%;
  }
</style>
