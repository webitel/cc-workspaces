<template>
  <div>
    <h3>{{ $tc('objects.screenshots', 2) }}</h3>
    <wt-table
      class="screenshots-table"
      :data="data"
      :headers="headers"
      :selectable="false"
    >
      <template #screenshot="{ item }">
        <img
          class="screenshots-table__preview"
          :src="getMediaUrl(item.id, false)"
        >
      </template>
      <template #dataAndTime="{ item }">
        {{ getTime(item.uploaded_at) }}
      </template>
      <template #actions="{ item }">
        <wt-icon-btn
          icon="download"
          @click="downloadFile(item.id)"
        />
        <wt-icon-btn
          icon="bucket"
          @click="removeFile(item)"
        />
      </template>
  </wt-table>
  </div>
</template>
<script setup lang="ts">
import { computed, onActivated, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { eventBus } from '@webitel/ui-sdk/scripts';
import { applyTransform, notify } from '@webitel/api-services/api/transformers';

import { FileServicesAPI } from '@webitel/api-services/api';
import { formatDate } from '@webitel/ui-sdk/utils';
import { FormatDateMode } from '@webitel/ui-sdk/enums';
import {
  downloadFile,
  getMediaUrl,
} from '@webitel/api-services/api';

const { t } = useI18n();
const store = useStore();

const data = ref([]);

const headers = computed(() => [
  { value: 'screenshot', text: t('objects.screenshots', 2) },
  { value: 'name', text: t('reusable.name') },
  { value: 'dataAndTime', text: t('reusable.dateTime') },
]);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const loadScreenshots = async () => {
  if (!call.value?.id) return;
  try {
    const res = await FileServicesAPI.getListByCall({ callId: call.value.id });
    data.value = res.items;
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const removeFile = (item) => {
  FileServicesAPI.delete([item.id]).then(res =>
    data.value = data.value.filter(file => file.id !== item.id),
  );
};
const getTime = (time) => formatDate(new Date(Number(time)), FormatDateMode.DATETIME);

const handleScreenshotsUpdated = (payload: { callId: string }) => {
  if (payload.callId === call.value?.id) {
    loadScreenshots();
  }
};

onActivated(async () => {
  await loadScreenshots();
  eventBus.$on('screenshots:updated', handleScreenshotsUpdated);
});

onBeforeUnmount(() => {
  eventBus.$off('screenshots:updated', handleScreenshotsUpdated);
});
</script>

<style scoped lang="scss">
.screenshots-table__preview {
  max-width: 100%;
  width: var(--screenshots-table-preview-width);
  height: var(--p-player-cam-preview-sm-height);
}
</style>
