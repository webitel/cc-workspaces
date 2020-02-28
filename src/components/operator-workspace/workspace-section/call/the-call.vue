<template>
  <section class="call">
    <call-preview v-if="state === 'PREVIEW'"></call-preview>
    <active-call v-else-if="state === 'ACTIVE' || state === 'NEW'"></active-call>
    <section v-else>hello there</section>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import CallPreview from './call-preview.vue';
  import ActiveCall from './active-call.vue';

  export default {
    name: 'the-call',
    components: {
      CallPreview,
      ActiveCall,
    },

    computed: {
      ...mapState('operator', {
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
