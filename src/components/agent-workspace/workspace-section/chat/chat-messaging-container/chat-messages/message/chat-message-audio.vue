<template>
  <div
    v-if="audio"
    class="chat-message-audio"
    @click="$emit('open', audio)"
  >
    <wt-player1
      :src="audio.url"
      :autoplay="false"
    ></wt-player1>
  </div>
</template>

<script>
import WtPlayer1 from './webitel-ui/wt-player.vue';
import chatMessageDetailMixin from '../../../../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-audio',
  mixins: [chatMessageDetailMixin],
  components: {
    WtPlayer1,
  },
  computed: {
    audio() {
      const isAudio = this.message.file && this.message.file.mime.includes('video');
      return isAudio ? this.message.file : null;
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
