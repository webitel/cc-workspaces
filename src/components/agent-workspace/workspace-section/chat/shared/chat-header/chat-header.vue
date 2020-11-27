<template>
  <header class="chat-header">
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper">
      <img src="../../../../../../assets/agent-workspace/default-avatar.svg" alt="client pic">
    </div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper">
      <wt-rounded-action icon="chat-end" color="danger" @click="close"></wt-rounded-action>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'chat-header',
  methods: {
    ...mapActions('chat', {
      close: 'CLOSE',
    }),
  },
};
</script>

<style lang="scss" scoped>
.chat-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px;
  padding: 10px;

  .chat-header__cell-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
}
</style>
