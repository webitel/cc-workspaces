<template>
  <section class="call">
    <call-preview v-if="!itemInstance"></call-preview>
    <active-call v-else></active-call>
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
        itemInstance: (state) => state.openedItem.item,
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .call {
    height: 100%;
  }
</style>
