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
      :title="media.name"
      countdown-time-mode
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
      countdown-time-mode
      hide-volume-slider
      hide-mute-button
      class="chat-message-player__player"
      @initialized="handlePlayerInitialize"
    />

  </div>
</template>

<script setup lang="ts">
import { type ChatMessageFile, useChatMessageFile } from '@webitel/ui-chats/ui';
import { WtPlayer, WtVidstackPlayer } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';

const props = defineProps<{
	file: ChatMessageFile;
}>();

const emit = defineEmits<{
	(e: 'initialized', player: unknown): void;
	(e: 'open', media: unknown): void;
}>();

const { media } = useChatMessageFile(props.file);

const mediaSrcObject = computed(() => ({
	src: media.value?.streamUrl || media.value?.url,
	type: media.value?.mime,
}));

const isVideo = computed(() => media.value?.mime?.includes('video'));

function handlePlayerInitialize(player: unknown) {
	emit('initialized', player);
}
</script>

<style lang="scss" scoped>
.chat-message-player {
  min-height: var(--player-audio-height);
  min-width: 250px;

  .chat-message-player__player {
    width: 100%;
  }

  :deep(.wt-vidstack-player) {
    height: var(--chat-video-player-height);
    width: var(--chat-video-player-width);
  }
}
</style>
