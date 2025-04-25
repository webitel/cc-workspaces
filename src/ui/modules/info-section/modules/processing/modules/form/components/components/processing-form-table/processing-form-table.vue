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
                @click="emit('call-table-action', props.componentId, action)"
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

const nextAllowed = ref(false);
const nextLoading = ref(false);
const currentTablePage = ref(1);
const dataList = ref([]);

const headers = computed(() => {
  return props.table?.displayColumns.map((header) => ({
    ...header,
    text: header.name,
    value: header.field,
  }));
});

const footerColumnName = computed(() => `${headers.value[0].value}-footer`);
const systemSourcePath = computed(() => props.table?.systemSource?.path);

async function getDataList() {

  const { items, next } = await TableApi.getList({
    path: systemSourcePath.value,
    page: currentTablePage.value,
  });

  return { items, next };
}

async function initList() {
  if (systemSourcePath.value) {

    const { items, next } = await getDataList();
    dataList.value = items;
    nextAllowed.value = next;

  } else dataList.value = props.table?.source || [];
}

async function loadNext() {
  nextLoading.value = true;

  currentTablePage.value +=1;
  const { items, next } = await getDataList();
  dataList.value = [...dataList.value, ...deepCopy(items)];
  nextAllowed.value = next;

  nextLoading.value = false;
}

initList();

</script>

<style lang="scss" scoped>
.processing-form-table {
  &__table {
    height: 600px;
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
