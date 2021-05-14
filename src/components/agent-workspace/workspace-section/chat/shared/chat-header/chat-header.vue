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
      <wt-rounded-action
        v-show="isCloseAction"
        icon="chat-end"
        color="danger"
        @click="close"
      ></wt-rounded-action>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'chat-header',
  computed: {
    ...mapState('chat', {
      chatOnWorkspace: (state) => state.chatOnWorkspace,
    }),
    isCloseAction() {
      window.taskOnWorkspace = this.chatOnWorkspace;
      return this.chatOnWorkspace.allowLeave || this.chatOnWorkspace.allowDecline;
    },
  },
  methods: {
    ...mapActions('chat', {
      close: 'CLOSE',
    }),
  },
};
</script>

<style lang="scss" scoped>
.chat-header {
  box-sizing: border-box;
  height: 100px;
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
