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
        <div
          ref="infiniteScrollWrap"
          class="processing-form-table__scroll-wrapper"
        >
          <wt-table
            class="processing-form-table__table"
            :data="dataList"
            :headers="headers"
            :selectable="false"
            :grid-actions="false"
          >
            <template
              v-for="action in props.actions"
              #[action.field]="{ item }"
              :key="action.field"
            >
              <div class="processing-form-table__action">
                <p>
                  {{ item[action.field] }}
                </p>
                <wt-button
                  :color="action.color"
                  @click="sendAction(action.action, item)"
                >
                  {{ action.buttonName }}
                </wt-button>
              </div>
            </template>
          </wt-table>
        </div>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script setup>

import { useInfiniteScroll } from '@vueuse/core';
import { getDefaultGetListResponse } from '@webitel/api-services/api/defaults';
import {
  applyTransform,
  merge,
  snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { computed, defineProps, inject, onMounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import TableApi from './api/table';
import getNestedValue from './scripts/getNestedValue';

const { t } = useI18n();

const props = defineProps({
  componentId: {
    type: String,
    required: true,
  },
  table: { // get from v-bind in parent component
    type: Object,
    required: true,
  },
  filters: {
    type: Object,
    required: true,
  },
  fields: {
    type: Array,
    default: () => [],
  },
  actions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'call-table-action',
]);

const eventBus = inject('$eventBus');

// @author @liza-pohranichna
// https://webitel.atlassian.net/browse/WTEL-6890
const columnsFieldSeparator = '.';

const nextAllowed = ref(false);
const nextLoading = ref(false);
const currentTablePage = ref(1);
const dataList = ref([]);
const infiniteScrollWrap = useTemplateRef('infiniteScrollWrap');

const isSystemSource = computed(() => props.table?.isSystemSource);
const systemSourcePath = computed(() => props.table?.systemSource?.path);

const filters = computed(() => props?.filters || []);
const tableFields = computed(() => props?.fields || []);

const tableColumns = computed(() => {
  return props.table?.displayColumns.map((column) => {

    // @author @liza-pohranichna
    // reformatting path to nested object from string to array. Example: 'contact.emails.name' ====> ['contact', 'emails', 'name']
    let fieldPath = column.field.includes(columnsFieldSeparator)
      ? column.field.split(columnsFieldSeparator)
      : [column.field];

    fieldPath = applyTransform(fieldPath, [snakeToCamel()]);

    return {
      ...column,
      field: fieldPath[0],
      fieldPath,
    };
  });
});

const headers = computed(() => {
  return tableColumns.value.map((header) => ({
    ...header,
    text: header.name,
    value: header.field,
    width: header.width ? header.width + 'px' : '',
  }));
});

async function handleTableList(dataList) {
  return dataList.map((item) => {
    let newItem = item;

    for (const key in newItem) { // look inside every field in item @author @liza-pohranichna
      let value = newItem[key];
      const pathToNestedValue = tableColumns.value.find((column) => column.field === key)?.fieldPath || []; // Example of pathToNestedValue ['contact', 'name'] @author @liza-pohranichna
      const isNeedNestedValue = value && typeof value === 'object' && pathToNestedValue.length;

      value = isNeedNestedValue ? getNestedValue(value, pathToNestedValue) : value;
      newItem = { ...newItem, [key]: value };
    }

    return newItem;
  });
}

async function getDataList() {
  const fields = headers.value.map((item) => (item.value)); // all fields we want to get from API @author @liza-pohranichna
  try {
    const { items, next } = await TableApi.getList({
      path: systemSourcePath.value,
      filters: filters.value,
      page: currentTablePage.value,
      fields: [...fields, ...tableFields.value],
    });

    return { items, next };
  } catch (error) {
    eventBus.$emit('notification', {
      type: 'error',
      text: t('infoSec.processing.form.formTable.error'),
    });

    throw error;
  }
}

async function initDataList() {
  let data;

  if (isSystemSource.value) {

    const { items, next } = await getDataList();
    data = items;
    nextAllowed.value = next;

  } else data = applyTransform(props.table?.source, [
    merge(getDefaultGetListResponse()),
    snakeToCamel(),
  ]);

  dataList.value = await handleTableList(data);
}

async function loadNext() {
  nextLoading.value = true;

  currentTablePage.value += 1;
  const { items, next } = await getDataList();
  const newItems = await handleTableList(items);

  dataList.value = [...dataList.value, ...newItems];
  nextAllowed.value = next;

  nextLoading.value = false;
}

function sendAction(action, row) {
  const payload = {
    componentId: props.componentId,
    action,
    row,
  };
  emit('call-table-action', payload);
}

onMounted(() => {
  initDataList();
});

useInfiniteScroll(infiniteScrollWrap,
  () => {
    loadNext();
  },
  {
    distance: 100,
    canLoadMore: () => (!nextLoading.value && nextAllowed.value),
  },
);

</script>

<style lang="scss" scoped>
.processing-form-table {
  &__table {
    padding: var(--spacing-xs);
  }

  &__scroll-wrapper {
    @extend %wt-scrollbar;
    height: 600px;
    overflow: auto;
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

  &__action {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
