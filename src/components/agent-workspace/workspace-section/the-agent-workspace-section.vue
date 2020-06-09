<template>
  <section class="workspace-section">
    <call v-if="isCall"/>
    <member v-else-if="isMember"/>
    <empty-workspace v-else/>
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

      isCall() {
        return this.state === WorkspaceStates.CALL;
      },

      isMember() {
        return this.state === WorkspaceStates.MEMBER;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chat {
    height: 100%;
  }
</style>
