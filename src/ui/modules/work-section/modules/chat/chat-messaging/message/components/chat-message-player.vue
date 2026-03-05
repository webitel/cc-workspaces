<template>
  <div
    v-if="media"
    class="chat-message-player"
    @click="$emit('open', media)"
  >
    <wt-vidstack-player
      v-if="isVideo"
      static
      hide-expand
      stretch
      :size="ComponentSize.SM"
      :src="mediaSrc"
    />
    <wt-player
      v-else
      :src="mediaSrc"
      :autoplay="false"
      :closable="false"
      hide-volume-slider
      countdown-time-mode
      class="chat-message-player__player"
      @initialized="handlePlayerInitialize"
    />

  </div>
</template>

<script>
import { WtVidstackPlayer, WtPlayer } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import chatMessageFileMixin from '../../../mixins/chatMessageFileMixin.js';

export default {
	name: 'ChatMessagePlayer',
	mixins: [
		chatMessageFileMixin,
	],
	components: {
		WtVidstackPlayer,
		WtPlayer,
	},
	computed: {
		ComponentSize() {
			return ComponentSize;
		},
		mediaSrc() {
			return {
				src: this.media.streamUrl || this.media.url,
				type: this.media.type,
			};
		},
		isVideo() {
			console.log('mediaSrc:', this.mediaSrc, 'file;', this.file);
			return this.mediaSrc.type?.includes('video');
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
  min-height: var(--player-audio-height);
  min-width: 250px;

  .chat-message-player__player {
    width: 100%;
  }
}
</style>
