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
    const fieldPath = column.field.includes(columnsFieldSeparator) // path to nested value from object (displayed as an array). Example: 'contact.emails.name' will look like ['contact', 'emails', 'name']
      ? column.field.split(columnsFieldSeparator)
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

function getNestedValue(parentValue, path) { // якщо updatedBy:{id: '4', name: 'Софія111111'} і шлях updatedBy.name, то має повернутись updatedBy: 'Софія111111'
  // метод для заглиблення в об'єкт TODO схоже на скріпт, шоб перевикористовувати десь
  // TODO сюди трапляє об'єкт/масив поля, в який треба заглибитись та шлях, куди(!) треба заглибитись
  if (path.length <= 1) return parentValue;

  path = path.slice(1); // first of all delete previous path step

  const key = path[0]; // take key of object for next path step

  if (Array.isArray(parentValue)) {
    return parentValue.map((object) => (getNestedValue(object[key], path))); // get needed value from every object in array
  }
  else if (typeof parentValue === 'object') return getNestedValue(parentValue[key], path);

  else return parentValue;


  // ! Корисно: collection[id][prop] = collection[id][prop] || []; https://forum.freecodecamp.org/t/sorting-attributes-inside-js-objects/423653


  // трансформувати атемс таким чином, щоб кожен об'єкт в масиві став "плоским"?
  // і кожен хедер мав тільки те значення, яке вказано в шляху. тобто якщо contact.name.common_name, то тоді це буде { contact: contact.name.common_name }
  // contact = в залежності від значення того, що лежить в contact.name.common_name
  // використовувати tableColumns.fieldPath як орієнтир в тому, куди мені треба лізти в об'єкті

}

function handleDataList(dataList) {

  return dataList.map((item) => { // беремо основний масив items

    tableColumns.value.forEach((column) => {
      const valueOfItem = item[column.field];
      const path = column.fieldPath.slice(1) // delete from path first step

      if (typeof valueOfItem === 'object' || path.length) return getNestedValue(valueOfItem, path); // Example of path ['contact', 'name']
      else return item;
    });


  })
}

// let arrayOfItemProperties = Object.entries(item); // item object to array
// arrayOfItemProperties = arrayOfItemProperties.map((property) => { // перебір по значенням об'єкту item
//
//   const columnOfProperty = tableColumns.value.find((column) => column.field === property); // шукаємо колонку(хедер), який співпадає зі значенням
//
//   if (columnOfProperty.fieldPath.length > 1) {
//     return getNestedValues({ array: property, path: columnOfProperty.fieldPath });
//   } else return property;
// });
// const newItem = Object.fromEntries(arrayOfItemProperties); // return from array to object

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

  handleDataList(data); // !! не використовується, лише запускається

  dataList.value = data;
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
