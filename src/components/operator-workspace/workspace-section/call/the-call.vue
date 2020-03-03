<template>
  <section class="call">
    <call-preview v-if="state === 'PREVIEW'"></call-preview>
    <active-call v-else-if="state === 'ACTIVE' || state === 'NEW'"></active-call>
    <section v-else>hello there
      <comp
        v-model="varia"
      ></comp>
    </section>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import Comp from '../../../utils/search-input.vue';
  import CallPreview from './call-preview.vue';
  import ActiveCall from './active-call.vue';

  export default {
    name: 'the-call',
    components: {
      CallPreview,
      ActiveCall,
      Comp,
    },

    data: () => ({
      varia: 'variabl',
    }),

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
