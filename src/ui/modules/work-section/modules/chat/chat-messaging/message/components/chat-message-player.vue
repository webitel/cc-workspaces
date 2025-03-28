<template>
  <div
    v-if="media"
    class="chat-message-player"
    @click="$emit('open', media)"
  >
    <wt-player
      :src="mediaUrl"
      :mime="type"
      :autoplay="false"
      :hide-duration="type.includes('video')"
      reset-on-end
      reset-volume
      @initialized="handlePlayerInitialize"
    />
  </div>
</template>

<script>
import chatMessageFileMixin from '../../../mixins/chatMessageFileMixin.js';

export default {
  name: 'ChatMessagePlayer',
  mixins: [chatMessageFileMixin],
  computed: {
    mediaUrl() {
      return this.media.streamUrl || this.media.url;
    },
  },
  methods: {
    handlePlayerInitialize(player) {
      this.$emit('initialized', player);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-player {
  .wt-player :deep(.plyr) {
    .wt-player__close-icon,
    //.plyr__menu,
    //.plyr__control[download]
    .plyr__volume {
      display: none;
    }

    &.plyr--video {
      max-height: var(--chat-file-max-height);
      max-width: var(--chat-file-max-width);
    }
  }
}
</style>
