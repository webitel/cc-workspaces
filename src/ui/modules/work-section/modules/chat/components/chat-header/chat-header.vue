<template>
  <header class="chat-header">
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper">
      <img src="../../../shared/assets/avatars/default-avatar.svg" alt="client pic">
    </div>
    <div class="chat-header__cell-wrapper"></div>
    <div class="chat-header__cell-wrapper">
      <wt-rounded-action
        v-show="isTransferAction"
        icon="chat-transfer"
        color="transfer"
        rounded
        wide
        @click="$emit('openTab', 'transfer')"
      ></wt-rounded-action>
    </div>
    <div class="chat-header__cell-wrapper">
      <wt-rounded-action
        v-show="isCloseAction"
        icon="chat-end"
        color="danger"
        rounded
        wide
        @click="close"
      ></wt-rounded-action>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'chat-header',
  computed: {
    ...mapGetters('chat', {
      isCloseAction: 'ALLOW_CHAT_CLOSE',
      isTransferAction: 'ALLOW_CHAT_TRANSFER',
    }),
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
