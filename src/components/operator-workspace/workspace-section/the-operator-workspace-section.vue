<template>
  <section class="workspace-section">
    <chat v-if="false"></chat>
    <call></call>
  </section>
</template>

<script>
  import Call from './call/the-call.vue';
  import Chat from './chat/the-chat.vue';

  export default {
    name: 'the-operator-workspace-section',
    components: {
      Chat,
      Call,
    },
  };
</script>

<style lang="scss" scoped>
  .workspace-section {
    padding: 20px;
  }

  .chat {
    height: 100%;
  }
</style>
