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
import chatMessageFileMixin from '../../../../mixins/chatMessageFileMixin.js';

export default {
  name: 'chat-message-image',
  mixins: [chatMessageFileMixin],
};
</script>

<style lang="scss" scoped>
$max-width: 240px;

.chat-message-image {
  max-width: $max-width;
  cursor: pointer;

  &__img {
    @extend %typo-body-1;
    width: 100%;
  }
}
</style>
