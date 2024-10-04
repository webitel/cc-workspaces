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
import chatMessageFileMixin from '../../../../mixins/chatMessageFileMixin.js';

export default {
  name: 'chat-message-player',
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
  .wt-player ::v-deep {
    .wt-player__close-icon,
    //.plyr__menu,
    .plyr__volume,
    //.plyr__control[download]
    {
      display: none;
    }
  }

  :deep video {
    max-height: var(--chat-image-max-height);
    max-width: var(--chat-image-min-width);
  }
}
</style>
