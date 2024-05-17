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
      :hide-duration="audio.mime.includes('video')"
      reset-on-end
      reset-volume
      @initialized="handlePlayerInitialize"
    />
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
      return this.size === 'md' && this.audio.mime.includes('video')
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
