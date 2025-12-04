<template>
  <h3>{{ $tc('objects.screenshots', 2) }}</h3>
  <wt-table
    :data="data"
    :headers="headers"
    :selectable="false"
  >
    <template #screenshot="{ item }">
      <img :src="getScreenRecordingMediaUrl(item.id, false)">
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
        @click="removeFile"
      />
    </template>
  </wt-table>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FileServicesAPI } from '@webitel/api-services/api';
import { formatDate } from '@webitel/ui-sdk/utils';
import { FormatDateMode } from '@webitel/ui-sdk/enums';
import {
  downloadFile,
  getScreenRecordingMediaUrl,
} from '@webitel/api-services/api';

const { t } = useI18n();

const data = ref([]);

const headers = ref([
  { value: 'screenshot', text: t('objects.screenshots', 2) },
  { value: 'name', text: t('reusable.name') },
  { value: 'dataAndTime', text: t('queueSec.call.dataAndTime') },
]);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const removeFile = (item) => {
  FileServicesAPI.delete(item.id).then(res =>
    data.value = data.value.filter(file => file.id !== item.id),
  );
};
const getTime = (time) => formatDate(new Date(time), FormatDateMode.DATETIME);

onMounted(async () => {
  FileServicesAPI.getListByCall(call.value.id).then(res => data.value = res.items)
})
</script>

<style scoped lang="scss">

</style>
