<template>
  <div class="screenshots-tab">
    <h3 class="screenshots-tab__title">{{ $tc('objects.screenshots', 2) }}</h3>
    <wt-dummy
      v-if="!data.length"
      :text="t('webitelUI.empty.text.empty')"
    />
    <wt-table
      v-else
      class="screenshots-tab__table"
      :data="data"
      :headers="headers"
      :selectable="false"
    >
      <template #screenshot="{ item }">
        <img
          class="screenshots-tab__table--preview"
          :src="getMediaUrl(item.id, false)"
          @click="openScreenshotInGalleria(item)"
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

  const { items } = await FileServicesAPI.getListByCall({
    callId: call.value.id,
  });

  data.value = items;
};

const openScreenshotInGalleria = (item: any) => {
  if (!call.value?.id || !item?.id) return;

  const index = data.value.findIndex((screenshot) => screenshot.id === item.id);
  eventBus.$emit('screenshots:open-galleria', {
    screenshotId: item.id,
    index: index >= 0 ? index : 0,
  });
};

const removeFile = (item) => {
  FileServicesAPI.delete([item.id]).then(() => {
    data.value = data.value.filter(file => file.id !== item.id);
  });
};
const getTime = (time) => formatDate(new Date(Number(time)), FormatDateMode.DATETIME);

onActivated(async () => {
  await loadScreenshots();
  eventBus.$on('screenshots:updated', loadScreenshots);
});

onBeforeUnmount(() => {
  eventBus.$off('screenshots:updated', loadScreenshots);
});
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.screenshots-tab {

  &__title {
    @extend %typo-heading-3;
  }

  &__table--preview {
    max-width: 100%;
    width: var(--screenshots-table-preview-width);
    height: var(--p-player-cam-preview-sm-height);
  }
}
</style>
