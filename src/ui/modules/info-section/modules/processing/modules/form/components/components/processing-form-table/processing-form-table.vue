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
              v-for="action in tableActions"
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

<script setup lang="ts">

import { useInfiniteScroll } from '@vueuse/core';
import { getDefaultGetListResponse } from '@webitel/api-services/api/defaults';
import {
  applyTransform,
  merge,
  snakeToCamel,
} from '@webitel/api-services/api/transformers';
import type { WtTableHeader } from '@webitel/ui-sdk/components/wt-table/types/WtTable';
import eventBus from '@webitel/ui-sdk/scripts/eventBus.js';
import { computed, defineProps, inject, onMounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import TableApi from './api/table';
import getNestedValue from './scripts/getNestedValue';
import getPathArray from './scripts/getPathArray';
import type { Table, TableAction, TableColumn, TableFilter, TableRow } from './types/FormTable';

const { t } = useI18n();

interface Props {
  componentId: string
  table: Table
  filters: TableFilter[]
  fields?: string[]
  actions?: TableAction[]
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  actions: () => [],
});

const emit = defineEmits<{
  (e: 'call-table-action', payload: TableRow): void
}>()

// @author @liza-pohranichna
// why? => https://webitel.atlassian.net/browse/WTEL-6890
const columnsFieldSeparator = '.';

const nextAllowed = ref(false);
const nextLoading = ref(false);
const currentTablePage = ref(1);
const dataList = ref<TableRow[]>([]);
const infiniteScrollWrap = useTemplateRef('infiniteScrollWrap');

const isSystemSource = computed<boolean>(() => props.table?.isSystemSource);
const systemSourcePath = computed<string>(() => props.table?.systemSource?.path);

const tableFields = computed<string[]>(() => { // fields for API request
  let fields:string[] = props.fields;
  if (tableColumns.value.length) {
    // @author @liza-pohranichna
    // try to get all fields from tableColumns
    const fieldsFromColumns:string[] = tableColumns.value.map((column) => ( column.pathArray[0] ));
    fields = [...new Set([...props.fields, ...fieldsFromColumns])]; // merge arrays and remove duplicates
  }
  return fields;
});

function normalizeSlotKey(key: string): string {
  // @author @liza-pohranichna
  // need this for slots in wt-table component.
  // Example: 'contact.emails[11].name' ====>  'contact_emails_11_name'
  return key
  .replace(columnsFieldSeparator, '_')
  .replace('[', '_')
  .replace(']', '_');
}

const tableColumns = computed<TableColumn[]>(() => {
  return props.table?.displayColumns.map((column) => {

    const pathArray = applyTransform(getPathArray(column.field, columnsFieldSeparator), [snakeToCamel()]);
    return {
      ...column,
      header: normalizeSlotKey(column.field) , // normalize slot key for wt-table component
      pathArray, // array with "steps" to nested value. Example: ['contact', 'emails', 'name'],
    }
  })
});

const headers = computed<WtTableHeader[]>(() => { // headers for wt-table prop
  return tableColumns.value.map((column) => ({
    ...column,
    value: column.header,
    text: column.name,
    width: column.width ? column.width + 'px' : '',
  }));
});
const tableActions = computed<TableAction[]>(() => {
  return props.actions.map((action: TableAction) => ({
    ...action,
    field: normalizeSlotKey(action.field),
  }));
});

function handleTableList(tableList: TableRow[]): TableRow[] {

  return tableList.map((item: TableRow) => {
    let newItem = { ...item }; // table row

    tableColumns.value.forEach((column: TableColumn) => { // iterate all columns to get needed value for each table cell in row
      const [firstStep, ...restSteps] = column.pathArray; // get first step and rest steps from pathArray. Example: ['emails', 'data', 'name'] => firstStep = 'emails', restSteps = ['data', 'name']
      const value = item[firstStep]; // get value by first step from item. Example: item['emails']

      const newValue = restSteps?.length // if we have steps to get nested value
        ? getNestedValue(value, restSteps) // try to get nested value by steps
        : value; // or just use initial value

      newItem = {
        ...newItem,
        [column.header]: newValue // set new value in item by column header. Example: contact_emails_11_name: 'John Doe'
      };

    });

    return newItem;
  });
}

async function getDataList(): Promise<{ items: TableRow[], next: boolean }> {
  try {
    const { items, next } = await TableApi.getList({
      path: systemSourcePath.value,
      filters: props.filters,
      page: currentTablePage.value,
      fields: tableFields.value,
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

async function initDataList(): Promise<void> {
  let data: TableRow[];

  if (isSystemSource.value) {

    const { items, next } = await getDataList();
    data = items;
    nextAllowed.value = next;

  } else data = applyTransform(props.table?.source, [
    merge(getDefaultGetListResponse()),
    snakeToCamel(),
  ]);

  dataList.value = handleTableList(data);
}

async function loadNext(): Promise<void> {
  nextLoading.value = true;

  currentTablePage.value += 1;
  const { items, next } = await getDataList();
  const newItems: TableRow[] = handleTableList(items);

  dataList.value = [...dataList.value, ...newItems];
  nextAllowed.value = next;

  nextLoading.value = false;
}

function sendAction(action: string, row: TableRow): void {
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
    canLoadMore: () => (!nextLoading.value && nextAllowed.value)
  }
)

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
