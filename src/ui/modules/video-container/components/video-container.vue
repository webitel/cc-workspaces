<template>
  <wt-galleria
    v-model:visible="galleriaVisible"
    v-model:active-index="galleriaActiveIndex"
    :value="galleriaData"
    @download="downloadFile(screenshotData[galleriaActiveIndex].id)"
    @delete="handleDeleteFromGalleria"
  />
  <video-call
    v-if="isVideo"
    :sender:stream=senderStream
    :receiver:stream="receiverStream"
    :sender:video:enabled="!mutedVideo"
    :receiver:video:enabled="isSenderVideo"
    :screenshot:status="screenshotStatus"
    :screenshot:loading="screenshotIsLoading"
    :screenshot:src="screenshotPreviewUrl"
    :recordings="recordings"
    :actions="videoCallActions"
    :username="userName"
    :overlay="false"
    position="left-bottom"
    @action:screenshot="onScreenshot"
    @action:recordings="onToggleRecordings"
    @action:zoom-screenshot="onZoomScreenshot"
    @action:close-screenshot="onCloseScreenshot"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { VideoCall, VideoCallAction } from '@webitel/ui-sdk/modules/CallSession';
import { WtGalleria } from '@webitel/ui-sdk/components';
import { FileServicesAPI, downloadFile, getMediaUrl } from '@webitel/api-services/api';
import { applyTransform, notify } from '@webitel/api-services/api/transformers';
import { eventBus } from '@webitel/ui-sdk/scripts';

import { useScreenShot } from '../composable/useScreenshot';

const store = useStore();

const {
  screenshotStatus,
  screenshotIsLoading,
  screenshotPreviewUrl,
  makeScreenshot,
  toggleRecordAction,
  closeScreenshot,
} = useScreenShot();

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
  () => localStreams.value[0],
);

const receiverStream = computed<MediaStream | undefined>(
  () => peerStreams.value[0],
);
const isSenderVideo = computed(() =>
  localStreams.value.some((s) => s.getTracks().some((t) => t.kind === 'video')),
);

const isReceiverVideo = computed(() =>
  peerStreams.value.some((s) => s.getTracks().some((t) => t.kind === 'video')),
);

const isVideo = computed(() => isSenderVideo.value && isReceiverVideo.value);
const userName = computed(() => call.value.displayName || '');
const mutedVideo = computed(() => call.value.mutedVideo);
const recordings = computed<boolean>(() => !!call.value.recordings);
const onToggleRecordings = () => toggleRecordAction(call.value);

const onScreenshot = async (_payload, options) => {
  try {
    await makeScreenshot(call.value);
    eventBus.$emit('screenshots:updated');
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  } finally {
    options?.onComplete?.();
  }
};


const onCloseScreenshot = () => closeScreenshot();

const onZoomScreenshot = async () => {
  await getScreenshots();
  galleriaVisible.value = true;
};

const getScreenshots = async () => {
  try {
    const { items } = await FileServicesAPI.getListByCall({ callId: call.value.id });
    screenshotData.value = items;
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};


const galleriaData = computed(() =>
  screenshotData.value?.map((item) => ({
    src: getMediaUrl(item.id, false),
    thumbnailSrc: getMediaUrl(item.id, true),
    title: item.view_name,
    alt: item.view_name,
  })),
);

const handleDeleteFromGalleria = () => {
  handleDelete([screenshotData.value[galleriaActiveIndex.value]]);
  if (galleriaActiveIndex.value > 0) galleriaActiveIndex.value -= 1;
};

const handleDelete = async (items: any[]) => {
  try {
    await FileServicesAPI.delete(items.map((item) => item.id));
    eventBus.$emit('screenshots:updated');
  } finally {
    await getScreenshots();
  }
};
</script>
