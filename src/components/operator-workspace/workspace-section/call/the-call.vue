<template>
  <section class="call">
    <call-preview v-if="state === 'PREVIEW'"></call-preview>
    <active-call v-else-if="state === 'ACTIVE' || state === 'NEW'"></active-call>
    <section v-else class="empty-workspace">
      <img
        class="workspace-pic"
        src="../../../../assets/operator-workspace/ws-empty.png"
        alt="workspace is empty"
      >
    </section>
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

    data: () => ({}),

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

  .empty-workspace {
    height: 100%;
  }

  .workspace-pic {
    position: relative;
    top: 50%;
    display: block;
    margin: auto;
    transform: translateY(-50%);
  }
</style>
