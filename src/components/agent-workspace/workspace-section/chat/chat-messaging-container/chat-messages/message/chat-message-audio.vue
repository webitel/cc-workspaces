<template>
  <div
    v-if="audio"
    class="chat-message-audio"
    @click="$emit('open', audio)"
  >
    <wt-move-me-to-lib-player
      :src="audioUrl"
      :mime="audio.mime"
      :autoplay="false"
      reset-on-end
    ></wt-move-me-to-lib-player>
  </div>
</template>

<script>
import WtMoveMeToLibPlayer from './webitel-ui/wt-player.vue';
import chatMessageDetailMixin from '../../../../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-audio',
  mixins: [chatMessageDetailMixin],
  components: {
    WtMoveMeToLibPlayer,
  },
  computed: {
    audioUrl() {
      return this.audio.streamUrl || this.audio.url;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-audio {
  .wt-player ::v-deep {
    .wt-player__close-icon,
    .plyr__menu,
    .plyr__volume,
    .plyr__control[download] {
      display: none;
    }
  }
}
</style>
