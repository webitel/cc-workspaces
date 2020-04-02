<template>
  <section class="call">
    <call-preview v-if="isPreviewCall"></call-preview>
    <active-call v-else-if="isActiveCall"></active-call>
    <workspace-member v-else-if="isMemberOnWorkspace"></workspace-member>
    <empty-workspace v-else/>
  </section>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import CallStates from '../../../../store/callUtils/CallStates';
  import CallPreview from './call-preview.vue';
  import ActiveCall from './active-call.vue';
  import WorkspaceMember from '../workspace-member/workspace-member.vue';
  import EmptyWorkspace from '../empty-workspace/empty-workspace.vue';

  export default {
    name: 'the-call',
    components: {
      CallPreview,
      ActiveCall,
      WorkspaceMember,
      EmptyWorkspace,
    },

    data: () => ({
      CallStates,
    }),

    computed: {
      ...mapState('workspace', {
        state: (state) => state.callState,
      }),
      ...mapGetters('workspace/offlineQueue', {
        isMemberOnWorkspace: 'IS_MEMBER_ON_WORKSPACE',
      }),

      isPreviewCall() {
        return this.state === CallStates.PREVIEW;
      },

      isActiveCall() {
        return this.state === CallStates.ACTIVE
          || this.state === CallStates.NEW
          || this.state === CallStates.TRANSFER;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .call {
    height: 100%;
  }
</style>
