<template>
  <div v-if="image" class="chat-message-image" @click="$emit('open', image)">
    <img
      class="chat-message-image__img"
      :src="image.url"
      :alt="image.name"
      draggable="false"
    >
  </div>
</template>

<script>
import chatMessageFileMixin from '../../../mixins/chatMessageFileMixin.js';

export default {
  name: 'chat-message-image',
  mixins: [chatMessageFileMixin],
};
</script>

<style lang="scss" scoped>
.chat-message-image {
  cursor: pointer;

  &__img {
    @extend %typo-body-1;
    max-height: var(--chat-file-max-height);
    max-width: var(--chat-file-max-width);
    width: 100%;
  }
}
</style>
