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
