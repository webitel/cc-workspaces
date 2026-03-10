<template>
  <div
    v-if="media"
    class="chat-message-player"
    @click="$emit('open', media)"
  >
    <wt-vidstack-player
      v-if="isVideo"
      :size="ComponentSize.SM"
      :src="mediaSrcObject"
      static
      hide-expand
      stretch
      @initialized="handlePlayerInitialize"
    />
    <wt-player
      v-else
      :src="mediaSrcObject"
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
import { useVidstackSrc } from '@webitel/ui-sdk/src/components/wt-vidstack-player/composables/useVidstackSrc';

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
		mediaSrcObject() {
			return {
				src: this.media?.streamUrl || this.media?.url,
				type: this.media?.type,
			};
		},
		isVideo() {
			return this.media?.type?.includes('video');
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
