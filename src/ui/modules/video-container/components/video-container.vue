<template>
  <video-call
    v-if="isVideo"
    :sender="senderStream"
    :receiver="receiverStream"

    :recordings="recordings"
    :screenshot-status="screenshotStatus"
    :screenshot-is-loading="screenshotIsLoading"

    :screenshot-callback="onScreenshot"
    :recordings-callback="onToggleRecordings"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { VideoCall } from '@webitel/ui-sdk/src/modules/CallSession/index';

const store = useStore();

const call = computed<any>(
  () => store.getters['features/call/CALL_ON_WORKSPACE'] || {},
);

const peerStreams = computed<MediaStream[]>(() => call.value.peerStreams || []);
const localStreams = computed<MediaStream[]>(() => call.value.localStreams || []);

const senderStream = computed<MediaStream | undefined>(
  () => {
    return peerStreams.value[0] || localStreams.value[0]
  }
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

const isVideo = computed(() => isPeerVideo.value || isLocalVideo.value);

const recordings = computed<boolean>(() => !!call.value.recordings);
const screenshotStatus = computed(() => call.value.screenshotStatus ?? null);
const screenshotIsLoading = computed<boolean>(
  () => !!call.value.screenshotIsLoading,
);

const onToggleRecordings = () =>
  store.dispatch('features/call/videoCall/TOGGLE_RECORDINGS');
const onScreenshot = () => store.dispatch('features/call/videoCall/MAKE_SCREENSHOT');

</script>
