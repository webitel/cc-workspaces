<template>
  <section class="call">
    <call-preview v-if="state === CallStates.PREVIEW"></call-preview>
    <active-call v-else-if="state === CallStates.ACTIVE || state === CallStates.NEW"></active-call>
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
      ...mapState('agent', {
        state: (state) => state.callState,
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .call {
    height: 100%;
  }
</style>
