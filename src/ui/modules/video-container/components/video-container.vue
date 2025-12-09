<template>
  <video-call
    v-if="isVideo"
    v-bind="{
      'sender:stream': senderStream,
      'receiver:stream': receiverStream,
      'sender:video:enabled': isPeerVideo,
      'receiver:video:enabled': mutedVideo,
      recordings,
      'screenshot:status': screenshotStatus,
      'screenshot:loading': screenshotIsLoading,
      actions: videoCallActions,
      username: userName
    }"
    @action:screenshot="onScreenshot"
    @action:recordings="onToggleRecordings"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { VideoCall } from '@webitel/ui-sdk/src/modules/CallSession/index';
import { VideoCallAction } from '@webitel/ui-sdk/src/modules/CallSession/index';

const store = useStore();

const videoCallActions = [
  VideoCallAction.Screenshot,
  VideoCallAction.Recordings,
];
const call = computed<any>(
  () => store.getters['features/call/CALL_ON_WORKSPACE'] || {},
);

const peerStreams = computed<MediaStream[]>(() => call.value.peerStreams || []);
const localStreams = computed<MediaStream[]>(() => call.value.localStreams || []);

const senderStream = computed<MediaStream | undefined>(
  () => peerStreams.value[0]
);
const receiverStream = computed<MediaStream | undefined>(
  () => localStreams.value[0],
);

const isPeerVideo = computed(() =>
  peerStreams.value.some((stream) =>
    stream.getTracks().some((track) => track.kind === 'video'),
  ),
);

const isLocalVideo = computed(() =>
  localStreams.value.some((stream) =>
    stream.getTracks().some((track) => track.kind === 'video'),
  ),
);

const isVideo = computed(() => isPeerVideo.value && isLocalVideo.value);
const userName = computed(() => call.value.displayName|| '');
const mutedVideo = computed(() => call.value.mutedVideo);

const recordings = computed<boolean>(() => !!call.value.recordings);
const screenshotStatus = computed(() => call.value.screenshotStatus ?? null);
const screenshotIsLoading = computed<boolean>(
  () => !!call.value.screenshotIsLoading,
);

const onToggleRecordings = () =>
  store.dispatch('features/call/videoCall/TOGGLE_RECORDINGS', call.value.id);
const onScreenshot = () => store.dispatch('features/call/videoCall/MAKE_SCREENSHOT', call.value.id);

</script>
