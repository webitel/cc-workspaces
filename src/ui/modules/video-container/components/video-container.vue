<template>
  <div v-if="isVideo" class="video-container">
    <wt-galleria
      v-model:visible="galleriaVisible"
      v-model:active-index="galleriaActiveIndex"
      :value="galleriaData"
      @download="downloadFile(screenshotData[galleriaActiveIndex].id)"
      @delete="handleDeleteFromGalleria"
    />
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { VideoCall } from '@webitel/ui-sdk/src/modules/CallSession/index';
import VideoCallScreenshot from './video-call-screenshot/video-call-screenshot.vue';
import { WtGalleria } from '@webitel/ui-sdk/components';
import { FileServicesAPI } from '@webitel/api-services/api';
import {
  downloadFile,
  getScreenRecordingMediaUrl,
} from '@webitel/api-services/api';

const store = useStore();

const galleriaVisible = ref(false);
const galleriaActiveIndex = ref(0);
const screenshotData = ref([]);

const call = computed<any>(
  () => store.getters['features/call/CALL_ON_WORKSPACE'] || {},
);

const peerStreams = computed<MediaStream[]>(() => call.value.peerStreams || []);
const localStreams = computed<MediaStream[]>(() => call.value.localStreams || []);


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
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);

const galleriaData = computed(() => {
  return screenshotData.value?.map((item) => ({
    src: getScreenRecordingMediaUrl(item.id, false),
    thumbnailSrc: getScreenRecordingMediaUrl(item.id, true),
    title: item.view_name,
    alt: item.view_name,
  }));
});

const onToggleRecordings = (e) =>
  store.dispatch('features/call/videoCall/TOGGLE_RECORDINGS', e);
const onScreenshot = (e) => store.dispatch('features/call/videoCall/MAKE_SCREENSHOT', e);


const onCloseScreenshot = () =>
  store.dispatch('features/call/videoCall/CLOSE_SCREENSHOT');

const onZoomScreenshot = async () => {
  await getScreenshots()
  galleriaVisible.value = true;
};
const getScreenshots = async () => FileServicesAPI.getListByCall(call.value.id)
  .then(res => screenshotData.value = res.items)



const handleDeleteFromGalleria = () => {
  handleDelete([screenshotData.value[galleriaActiveIndex.value]]);
  if (galleriaActiveIndex.value > 0) galleriaActiveIndex.value -= 1;
};

const handleDelete = async (items: []) => {
  const deleteEl = (el) => {
    return FileServicesAPI.deleteScreenRecordingsByAgent({
      id: el.id,
      agentId: agentId,
    });
  };

  try {
    await Promise.all(items.map(deleteEl));
  } finally {
    await getScreenshots();
  }
};
</script>
<style scoped lang="scss">
.video-container {
  position: relative;
}
</style>
