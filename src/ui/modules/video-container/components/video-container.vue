<template>
  <wt-galleria
    v-model:visible="galleriaVisible"
    v-model:active-index="galleriaActiveIndex"
    :value="galleriaData"
    @download="downloadFile(screenshotData[galleriaActiveIndex].id)"
    @delete="handleDeleteFromGalleria"
  />
  {{ screenshotIsLoading }}
  <video-call
    v-if="isVideo"
    :sender:stream=senderStream
    :receiver:stream="receiverStream"
    :sender:video:enabled="isPeerVideo"
    :receiver:video:enabled="!mutedVideo"
    :screenshot:status="screenshotStatus"
    :screenshot:loading="screenshotIsLoading"
    :screenshot:src="screenshotPreviewUrl"
    :recordings="recordings"
    :actions="videoCallActions"
    :username="userName"
    @action:screenshot="onScreenshot"
    @action:recordings="onToggleRecordings"
    @action:ZoomScreenshot="onZoomScreenshot"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { VideoCall, VideoCallAction } from '@webitel/ui-sdk/modules/CallSession';
import { WtGalleria } from '@webitel/ui-sdk/components';
import { FileServicesAPI } from '@webitel/api-services/api';

import {
  downloadFile,
  getMediaUrl,
} from '@webitel/api-services/api';
const store = useStore();

const videoCallActions = [
  VideoCallAction.Screenshot,
  VideoCallAction.Recordings,
];

const galleriaVisible = ref(false);
const galleriaActiveIndex = ref(0);
const screenshotData = ref([]);

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
const screenshotStatus = computed(() => store.getters['features/call/videoCall/SCREENSHOT_STATUS']);
const screenshotIsLoading = computed<boolean>(
  () => store.getters['features/call/videoCall/SCREENSHOT_IS_LOADING'],
);

const onToggleRecordings = () =>
  store.dispatch('features/call/videoCall/TOGGLE_RECORDINGS', call.value.id);
const onScreenshot = () => store.dispatch('features/call/videoCall/MAKE_SCREENSHOT', call.value.id);
const screenshotPreviewUrl = computed<string | null>(
  () => store.getters['features/call/videoCall/SCREENSHOT_PREVIEW_URL'],
);
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);

const galleriaData = computed(() => {
  return screenshotData.value?.map((item) => ({
    src: getMediaUrl(item.id, false),
    thumbnailSrc: getMediaUrl(item.id, true),
    title: item.view_name,
    alt: item.view_name,
  }));
});

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
