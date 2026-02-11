<template>
  <div v-if="image" class="chat-message-image" @click="$emit('open', image)">
    <img
      class="chat-message-image__img typo-body-1"
      :src="image.url"
      :alt="image.name"
      draggable="false"
    >
  </div>
</template>

<script>
import chatMessageFileMixin from '../../../mixins/chatMessageFileMixin.js';

export default {
	name: 'ChatMessageImage',
	mixins: [
		chatMessageFileMixin,
	],
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-message-image {
  cursor: pointer;

  &__img {
    max-height: var(--chat-file-max-height);
    max-width: var(--chat-file-max-width);
    width: 100%;
  }
}
</style>
