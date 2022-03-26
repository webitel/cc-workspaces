<template>
  <div v-if="image" class="chat-message-image" @click="$emit('open', image)">
    <img
      class="chat-message-image__img"
      :src="image.url"
      :alt="image.name">
  </div>
</template>

<script>
import chatMessageDetailMixin from '../../../../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-image',
  mixins: [chatMessageDetailMixin],
  computed: {
    image() {
      const isImage = this.message.file && this.message.file.mime.includes('image');
      return isImage ? this.message.file : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-image {
  cursor: pointer;

  &__img {
    @extend %typo-body-md;
    width: 100%;
  }
}
</style>
