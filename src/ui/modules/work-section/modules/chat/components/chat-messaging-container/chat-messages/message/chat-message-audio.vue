<template>
  <div
    v-if="audio"
    class="chat-message-audio"
    :class="{ 'chat-message-video--md': videoSizeMd }"
    @click="$emit('open', audio)"
  >
    <wt-player
      :src="audioUrl"
      :mime="audio.mime"
      :autoplay="false"
      reset-on-end
      reset-volume
      @initialized="handlePlayerInitialize"
    ></wt-player>
  </div>
</template>

<script>
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-audio',
  mixins: [chatMessageDetailMixin],
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  computed: {
    audioUrl() {
      return this.audio.streamUrl || this.audio.url;
    },
    videoSizeMd() {
      if (this.size === 'md' && this.audio.mime.includes('video')) {
        return true;
      }
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
.chat-message-audio {
  &.chat-message-audio--md {
   max-width: 80%;
  }
  .wt-player ::v-deep {
    .wt-player__close-icon,
    //.plyr__menu,
    .plyr__volume,
    //.plyr__control[download]
    {
      display: none;
    }
  }
}
</style>
