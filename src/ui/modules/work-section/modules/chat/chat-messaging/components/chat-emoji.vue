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

import sizeMixin from '../../../../../../../app/mixins/sizeMixin.js';

export default {
  name: 'ChatEmoji',
  mixins: [sizeMixin],
  data: () => ({
    picker: {},
    isOpened: false,
  }),
  mounted() {
    this.initPicker();
    this.picker.addEventListener('emoji-click', this.emitEmojiClickEvent);
  },
  unmounted() {
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
$input-height: 48px; // https://webitel.atlassian.net/browse/WTEL-6149 (comments)

.chat-emoji {
  width: 100%;
  position: relative;

  ::v-deep emoji-picker {
    --background: var(--content-wrapper-color);
    --border-color: var(--secondary-color);

    position: absolute;
    z-index: var(--ws-dropdown-z-index);
    bottom: calc(100% + $input-height);
    left: 100%;
    transform: translateX(-50%);
  }
}
</style>
