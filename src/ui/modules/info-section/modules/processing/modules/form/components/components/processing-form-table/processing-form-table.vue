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

          <template #[footerColumnName]>
            <wt-intersection-observer
              :next="nextAllowed"
              :loading="nextLoading"
              @next="loadNext"
            />
          </template>
        </wt-table>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script setup>

import  { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import deepCopy from 'deep-copy';
import { computed, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TableApi from './api/table';

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
  actions: {
    type: Array,
    default: () => [],
  }
});

const emit = defineEmits([
  'call-table-action',
]);

const columnsFieldSeparator = '.'; // from postprocessing flow we can get column value like path to nested object value. For example: contact.name https://webitel.atlassian.net/browse/WTEL-6890

const nextAllowed = ref(false);
const nextLoading = ref(false);
const currentTablePage = ref(1);
const dataList = ref([]);

const footerColumnName = computed(() => `${headers.value[0].value}-footer`);
const isSystemSource = computed(() => props.table?.isSystemSource);
const systemSourcePath = computed(() => props.table?.systemSource?.path);

const tableColumns = computed(() => {
  return props.table?.displayColumns.map((column) => {

    // reformatting path to nested object from string to array. Example: 'contact.emails.name' to ['contact', 'emails', 'name']
    const fieldPath = column.field.includes(columnsFieldSeparator)
        ? column.field.split(columnsFieldSeparator).map((item) => snakeToCamel(item))
        : [column.field];

    return {
      ...column,
      field: fieldPath[0],
      fieldPath,
    }
  })
});

const headers = computed(() => {
  return tableColumns.value.map((header) => ({
    ...header,
    text: header.name,
    value: header.field,
    width: header.width ? header.width + 'px' : '',
  }));
});

function getNestedValue(parentValue, path) {
  let nestedValue;

  if (path.length <= 1) return parentValue || '';

  const newPath = path.slice(1); // delete current path step before next step
  const key = newPath[0]; // take key of object for current path step

  if (Array.isArray(parentValue) && typeof parentValue[0] === 'object') {
      nestedValue = parentValue.map((object) => getNestedValue(object[key], newPath)) // get needed value from every object in array
  } else if (typeof parentValue === 'object') {
    nestedValue = getNestedValue(parentValue[key], newPath);
    // console.log('OBJECT: parentValue[key]:', parentValue[key], 'newPath:', newPath, 'nestedValue:', nestedValue);
  } else nestedValue = parentValue || '';
  // console.log('nestedValue:', nestedValue, 'parentValue, path:', parentValue, path);
  return nestedValue;

}


async function handleDataList(dataList) {

  const tableList = dataList.map((item) => {
    let newItem;

    tableColumns.value.forEach((column) => {
      const valueOfItem = item[column.field];

      if (typeof valueOfItem === 'object' && column.fieldPath.length) { // Example of fieldPath ['contact', 'name']
        const nestedValue = valueOfItem && column.fieldPath ? getNestedValue(valueOfItem, column.fieldPath) : '';
        console.log('column:', column.field, 'nestedValue:', nestedValue, 'valueOfItem:', valueOfItem);
        newItem = {
          ...item,
          [column.field]: nestedValue,
        }
        console.log('newItem:', newItem);
      }

    });
    return newItem;
  });
  return tableList;
}

async function getDataList() {

  const fields = headers.value.map((item) => ( item.value )); // all fields we want to get from API

  const { items, next } = await TableApi.getList({
    path: systemSourcePath.value,
    page: currentTablePage.value,
    fields,
  });

  return { items, next };
}

async function initList() {
  let data;

  if (isSystemSource.value) {

    const { items, next } = await getDataList();
    data = items;
    nextAllowed.value = next;

  } else data = props.table?.source || [];

  const tableList = await handleDataList(data);

  console.log('tableList:', tableList);

  dataList.value = tableList;
}

async function loadNext() {
  nextLoading.value = true;

  currentTablePage.value +=1;
  const { items, next } = await getDataList();
  dataList.value = [...dataList.value, ...deepCopy(items)];
  nextAllowed.value = next;

  nextLoading.value = false;
}

function sendAction(action, row) {
  const payload = {
    componentId: props.componentId,
    action,
    row,
  }
  emit('call-table-action', payload)
}

initList();

</script>

<style lang="scss" scoped>
.processing-form-table {
  &__table {
    height: 600px;
    max-height: 600px;
    padding: var(--spacing-xs);
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
