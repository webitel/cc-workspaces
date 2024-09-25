<template>
  <div
    v-clickaway="closePicker"
    class="chat-emoji"
  >
    <wt-rounded-action
      :size="size"
      color="secondary"
      icon="chat-emoji"
      rounded
      wide
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
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin.js';

export default {
  name: 'chat-emoji',
  mixins: [sizeMixin],
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
                                 i18n: this.$i18n.messages[this.$i18n.locale].emojiPicker,
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
.chat-emoji {
  width: 100%;
  position: relative;

  ::v-deep emoji-picker {
    --background: var(--content-wrapper-color);
    --border-color: var(--secondary-color);

    position: absolute;
    z-index: 1;
    bottom: calc(100% + var(--spacing-sm));
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
