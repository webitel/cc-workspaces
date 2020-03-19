<template>
  <section class="chat">
    <aside class="floating-actions">
      <rounded-action class="floating-action">Redirect</rounded-action>
      <rounded-action class="floating-action">Close</rounded-action>
    </aside>
    <message-container></message-container>
    <textarea></textarea>
  </section>
</template>

<script>
  import RoundedAction from '../../../utils/rounded-action.vue';
  import MessageContainer from './chat-messages-container.vue';

  export default {
    name: 'the-chat',
    components: {
      MessageContainer,
      RoundedAction,
    },
  };
</script>

<style lang="scss" scoped>
  .chat {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .floating-actions {
    position: absolute;
    right: 30px;
    top: 20px;

    .floating-action {
      margin-left: 20px;
    }
  }

  .messages-container {
    flex-grow: 1;
  }
</style>
