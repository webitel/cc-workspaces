<template>
  <footer class="chat-footer">
    <wt-textarea
      v-model="draft"
      :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
      name="draft"
    ></wt-textarea>
    <div class="chat-footer__actions">
      <div class="chat-footer__cell-wrapper"></div>
      <div class="chat-footer__cell-wrapper">
        <wt-rounded-action icon="attach" color="secondary" @click="() => {}"></wt-rounded-action>
      </div>
      <div class="chat-footer__cell-wrapper"></div>
      <div class="chat-footer__cell-wrapper"></div>
      <div class="chat-footer__cell-wrapper"></div>
      <div class="chat-footer__cell-wrapper">
        <wt-rounded-action icon="chat-send" color="secondary" @click="send"></wt-rounded-action>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'chat-footer',
  data: () => ({
    draft: '',
  }),
  methods: {
    ...mapActions('chat', {
      send: '',
    }),
  },
};
</script>

<style lang="scss" scoped>
.chat-footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
}

.wt-textarea {
  margin-bottom: 10px;
}

.chat-footer__actions {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;

  .chat-footer__cell-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
}

</style>
