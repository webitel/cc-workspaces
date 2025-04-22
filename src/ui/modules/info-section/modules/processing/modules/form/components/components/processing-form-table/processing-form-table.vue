<template>
  <div class="processing-form-table">
    <wt-expansion-panel collapsed>
      <template #title>
        <div class="processing-form-table__title">
          <div class="processing-form-table__title-icon-wrap">
            <wt-icon
              color="on-dark"
              icon="table"
            />
          </div>

          <span> {{ t('infoSec.processing.form.formTable.title') }} </span>
        </div>
      </template>
      <template #default>
        {{ headers }}
        <wt-table
          class="processing-form-table__table"
          :data="dataList"
          :headers="headers"
          :selectable="false"
          :grid-actions="false"
        />
        <wt-intersection-observer
          :next="nextPage"
          :loading="nextLoading"
          @next="loadNext"
        />
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script setup lang="ts">

import { computed, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TableApi from './api/table';

const { t } = useI18n();

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
});

const nextPage = ref(false);
const nextLoading = ref(false);
const tablePage = ref(1);
const dataList = ref([]);

const headers = computed<object>(() => {
  return props.table?.displayColumns.map((header) => ({
    ...header,
    text: header.name,
  }));
})


async function getDataList(pageNumber = 1) {

  const { items, next } = await TableApi.getList({
    path: props.table.systemSource.path,
    page: pageNumber,
  });

  dataList.value = [...dataList.value, items];
  nextPage.value = next;

  console.log('dataList', dataList.value, 'items:', items, 'next:', next);
}

async function initList(): Promise<void> {
  if (props.table?.systemSource?.path) await getDataList();
  else dataList.value = props.table?.source || [];
}

async function loadNext() {
  nextLoading.value = true;

  await getDataList(tablePage.value);

  nextLoading.value = false;
}



initList();

</script>

<style lang="scss" scoped>
.processing-form-table {
  &__table {
    height: 600px;
    max-height: 600px;
  }

  &__title {
    display: flex;
    justify-content: flex-start;
    gap: var(--spacing-sm);
  }

  &__title-icon-wrap {
    background: var(--icon-info-color);
    width: var(--icon-md-size);
    height: var(--icon-md-size);
    border-radius: var(--border-radius);
  }
}
</style>
