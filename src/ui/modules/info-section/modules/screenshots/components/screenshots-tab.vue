<template>
  <h3>{{ $tc('objects.quickReplies.quickReplies', 1) }}</h3>
  <wt-table
    :data="data"
    :headers="headers"
    :selectable="false"
  >
    <template #screenshot="{ item }">
      <img :src="item.screenshot" alt="screenshot">
    </template>
    <template #actions="{ item }">
      <wt-icon-btn
        icon="download"
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
import { FileServicesAPI } from '@webitel/api-services/api'

const { t } = useI18n();

const data = ref([]);

const headers = ref([
  { value: 'screenshot', text: t('objects.quickReplies.quickReplies', 1)},
  { value: 'name', text: t('reusable.name') },
  { value: 'dataAndTime', text: 'data&time'  }
]);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const removeFile = (item) => {
  FileServicesAPI.delete(item.id).then(res =>
    data.value = data.value.filter(file => file.id !== item.id)
  )
}

onMounted(async () => {
  FileServicesAPI.getListByCall(call.value.id).then(res => data.value = res.items)
})
</script>

<style scoped lang="scss">

</style>
