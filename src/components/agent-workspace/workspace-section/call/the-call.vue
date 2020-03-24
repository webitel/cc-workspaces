<template>
  <section class="call">
    <call-preview v-if="isPreviewCall"></call-preview>
    <active-call v-else-if="isActiveCall"></active-call>
    <empty-workspace v-else/>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import CallStates from '../../../../store/callUtils/CallStates';
  import CallPreview from './call-preview.vue';
  import ActiveCall from './active-call.vue';
  import EmptyWorkspace from '../empty-workspace.vue';

  export default {
    name: 'the-call',
    components: {
      CallPreview,
      ActiveCall,
      EmptyWorkspace,
    },

    data: () => ({}),

    computed: {
      CallStates: () => CallStates,
      ...mapState('workspace', {
        state: (state) => state.callState,
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
