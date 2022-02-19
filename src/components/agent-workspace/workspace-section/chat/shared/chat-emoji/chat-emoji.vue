<template>
  <div class="chat-emoji">
    <wt-rounded-action
      color="secondary"
      icon="chat-emoji"
      @click="$emit('click')"
    ></wt-rounded-action>
    <div
      v-show="isOpened"
      ref="emoji-picker"
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
  }),
  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.initPicker();
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
      this.$refs['emoji-picker'].appendChild(this.picker);
    },
    emitEmojiClickEvent(event) {
      this.$emit('insert-emoji', event);
    },
  },
  watch: {
    isOpened(value) {
      if (value === false) {
        this.picker.removeEventListener('emoji-click', this.emitEmojiClickEvent);
      } else {
        this.picker.addEventListener('emoji-click', this.emitEmojiClickEvent);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-emoji ::v-deep {
  position: relative;

  emoji-picker {
    position: absolute;
    bottom: 160px;
    left: -200px;
  }
}
</style>
