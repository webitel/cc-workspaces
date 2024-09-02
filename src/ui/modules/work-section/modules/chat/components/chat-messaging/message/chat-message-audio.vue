<template>
  <div
    v-if="audio"
    class="chat-message-audio"
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
import chatMessageDetailMixin from '../../../mixins/chatMessageDetailMixin.js';

export default {
  name: 'chat-message-audio',
  mixins: [chatMessageDetailMixin],
  computed: {
    audioUrl() {
      return this.audio.streamUrl || this.audio.url;
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
