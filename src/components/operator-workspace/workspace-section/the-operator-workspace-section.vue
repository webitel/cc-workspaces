<template>
  <section class="workspace-section">
    <!--    <chat v-if="false"></chat>-->
    <call/>
  </section>
</template>

<script>
  // import { mapState } from 'vuex';
  import Call from './call/the-call.vue';
  // import Chat from './chat/the-chat.vue';

  export default {
    name: 'the-operator-workspace-section',
    components: {
      // Chat,
      Call,
    },

    computed: {
      // ...mapState('operator', {
      //   type: (state) => state.openedItem.type,
      // }),
    },
  };
</script>

<style lang="scss" scoped>
  .chat {
    height: 100%;
  }
</style>
