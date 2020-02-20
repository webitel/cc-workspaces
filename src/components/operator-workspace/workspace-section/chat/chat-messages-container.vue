<template>
    <section class="messages-container">
      <chat-message></chat-message>
      <chat-message my></chat-message>
      <chat-message></chat-message>
      <chat-message my></chat-message>
    </section>
</template>

<script>
  import ChatMessage from './chat-message.vue';

  export default {
    name: 'chat-messages-container',
    components: {
      ChatMessage,
    },
  };
</script>

<style lang="scss" scoped>
</style>
