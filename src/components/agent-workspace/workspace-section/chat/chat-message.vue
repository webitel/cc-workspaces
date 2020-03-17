<template>
  <div class="message-wrap" :class="{'right': my}">
    <img class="message-pic" src="../../../../assets/agent-workspace/default-avatar.svg" alt="client photo">
    <div class="message">
      <div class="message__sender" v-if="!my">Vova Lomachenko</div>
      <p class="message__text">Ok! Thank you!</p>
    </div>
    <div class="message__time">10:15</div>
  </div>
</template>

<script>
  export default {
    name: 'chat-message',
    props: {
      // defines, if this is a user's message
      my: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .message-wrap {
    display: flex;
    margin-top: 10px;
    border: 1px solid blue;

    &.right {
      flex-direction: row-reverse;
      text-align: right;
    }
  }

  .message-pic {
    flex: 0 0 50px;
    width: 50px;
    height: 50px;
    border: 1px solid green;
    border-radius: 50%;
  }

  .message {
    margin: 0 10px;
    background: #ef6119;
  }

  .message__time {
    margin-top: auto;
  }
</style>
