<template>
  <section class="call">
    <call-preview v-if="isPreviewCall" />
    <active-call v-else-if="isActiveCall" />
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import CallStates from '../../../../store/modules/call/callUtils/CallStates';
  import CallPreview from './call-preview.vue';
  import ActiveCall from './active-call.vue';

  export default {
    name: 'the-call',
    components: {
      CallPreview,
      ActiveCall,
    },

    data: () => ({
      CallStates,
    }),

    computed: {
      ...mapState('call', {
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
