<template>
  <div
    ref="chat-emoji"
    class="chat-emoji"
  ></div>
</template>

<script>
import { Picker } from 'emoji-picker-element';

export default {
  name: 'chat-emoji-picker',
  data: () => ({
    picker: {},
  }),
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
      this.handleEmojiClick();
    },
    appendPicker() {
      this.$refs['chat-emoji'].appendChild(this.picker);
    },
    handleEmojiClick() {
      this.picker.addEventListener('emoji-click', (event) => {
        this.$emit('emoji-click', event);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-emoji ::v-deep {
  emoji-picker {
  }
}
</style>
