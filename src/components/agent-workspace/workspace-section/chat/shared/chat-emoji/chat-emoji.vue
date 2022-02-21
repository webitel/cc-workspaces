<template>
  <div
    v-clickaway="closePicker"
    class="chat-emoji"
  >
    <wt-rounded-action
      color="secondary"
      icon="chat-emoji"
      @click="isOpened = !isOpened"
    ></wt-rounded-action>
    <div
      v-show="isOpened"
      ref="emoji-picker-wrapper"
      class="chat-emoji__wrapper"
    ></div>
  </div>
</template>

<script>
import { Picker } from 'emoji-picker-element';

export default {
  name: 'chat-emoji',
  data: () => ({
    picker: {},
    isOpened: false,
  }),
  mounted() {
    this.initPicker();
    this.picker.addEventListener('emoji-click', this.emitEmojiClickEvent);
  },
  destroyed() {
    this.picker.removeEventListener('emoji-click', this.emitEmojiClickEvent);
  },
  methods: {
    initPicker() {
      // https://github.com/nolanlawson/emoji-picker-element#javascript-api
      this.picker = new Picker({
                                 i18n: this.$i18n.t('emojiPicker'),
                               });
      this.appendPicker();
    },
    appendPicker() {
      this.$refs['emoji-picker-wrapper'].appendChild(this.picker);
    },
    emitEmojiClickEvent(event) {
      const { unicode } = event.detail;
      this.$emit('insert-emoji', unicode);
    },
    closePicker() {
      this.isOpened = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-emoji ::v-deep {

  emoji-picker {
    position: absolute;
    bottom: 100%;
    z-index: 1;
  }
}
</style>
