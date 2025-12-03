<template>
  <div v-if="isVideo" class="video-container">
    <video-call
      v-if="isVideo"
      :sender="call.peerStreams[0]"
      :receiver="call.localStreams[0]"

      :recordings="recordings"
      :screenshot-status="screenshotStatus"
      :screenshot-is-loading="screenshotIsLoading"

      :screenshot-callback="onScreenshot"
      :recordings-callback="onToggleRecordings"
    />

    <video-call-screenshot
      v-if="screenshotPreviewUrl"
      :src="screenshotPreviewUrl"
      :right-side="false"
      @zoom="onZoomScreenshot"
      @close="onCloseScreenshot"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { VideoCall } from '@webitel/ui-sdk/src/modules/CallSession/index';
import VideoCallScreenshot from './video-call-screenshot/video-call-screenshot.vue';

const store = useStore();

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

const recordings = computed<boolean>(() => !!call.value.recordings);
const screenshotStatus = computed(() => call.value.screenshotStatus ?? null);
const screenshotIsLoading = computed<boolean>(
  () => !!call.value.screenshotIsLoading,
);

const screenshotPreviewUrl = computed<string | null>(
  () => store.getters['features/call/videoCall/SCREENSHOT_PREVIEW_URL'],
);

const onToggleRecordings = (e) =>
  store.dispatch('features/call/videoCall/TOGGLE_RECORDINGS', e);
const onScreenshot = (e) => store.dispatch('features/call/videoCall/MAKE_SCREENSHOT', e);


const onCloseScreenshot = () =>
  store.dispatch('features/call/videoCall/CLOSE_SCREENSHOT');

const onZoomScreenshot = () => {
  console.log('zoom screenshot', screenshotPreviewUrl.value);
};

</script>
<style scoped lang="scss">
.video-container {
  position: relative;
}
</style>
