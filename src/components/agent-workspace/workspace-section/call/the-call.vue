<template>
  <section class="call">
    <call-preview v-if="isPreviewCall" />
    <active-call v-else />
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
        call: (state) => state.callOnWorkspace,
      }),

      isPreviewCall() {
        return !this.call.answeredAt;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .call {
    height: 100%;
  }
</style>
