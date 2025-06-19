<template>
  <div class="form-select-service">
    <wt-expansion-panel
      :size="props.size"
      collapsed
    >
      <template #title>
        <div class="form-select-service__title">
          <div class="form-select-service__title-icon-wrap">
            <wt-icon
              color="on-dark"
              icon="union"
            />
          </div>

          <span> {{ catalogDataPatch }} </span>
        </div>
      </template>

      <template #default>
        <div class="form-select-service__content">
          <wt-search-bar
            :value="search"
            class="form-select-service__search-bar"
            @input="search = $event"
            @search="loadCatalogs"
          />
          <wt-loader
            v-if="loading"
            class="form-select-service__loader"
          />
          <wt-tree
            v-else
            class="form-select-service__tree"
            :model-value="selectedElement"
            :data="catalogData"
            item-label="name"
            item-data="id"
            children-prop="service"
            @update:model-value="updateForm"
          />
        </div>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script setup>

import { caseServiceCatalogs } from '@webitel/ui-sdk/src/api/clients/index.js';
import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import deepCopy from 'deep-copy';
import { computed, defineEmits, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: ComponentSize.MD,
  },
});

const emit = defineEmits([
  'input',
]);

const { t } = useI18n();

const selectedElement = ref(props.value?.id ?? null);
const search = ref('');
const catalogData = ref([]);
const loading = ref(false);

const loadCatalogs = async () => {
  try {
    loading.value = true;

    const { items } = await caseServiceCatalogs.getList({
      size: -1, // It this case for get all catalogs with services we need to pass size -1
      search: search.value,
      fields: ['id', 'name', 'closeReasonGroup', 'status', 'service'],
      hasSubservices: true,
      state: true,
    });

    catalogData.value = deepCopy(items);
  } finally {
    loading.value = false;
  }
};

const updateForm = (event) => {
  selectedElement.value = event;
  emit('input', event);
}

onMounted(() => {
  loadCatalogs();
});

const catalogDataNames = ref([]);
const catalogDataPatch = computed(() => selectedElement.value ? catalogDataNames.value.join(' / ') : t('cases.selectAService'));

// Author @Lera24
// [https://webitel.atlassian.net/browse/WTEL-6955]
// Builds the hierarchical path for the service within the catalog.
function findPath(services, targetId, path = []) {
  for (const service of services) {
    const newPath = [...path, service.name];

    if (service.id === targetId) {
      return newPath;
    }

    if (service.service && Array.isArray(service.service)) {
      const result = findPath(service.service, targetId, newPath);
      if (result) return result;
    }
  }
  return null;
}

const findCatalogDataNames = () => {
  if (!selectedElement.value) {
    catalogDataNames.value = null;
    return;
  }

  for (const catalog of catalogData.value) {
    if (catalog.service && Array.isArray(catalog.service)) {
      const path = findPath(catalog.service, selectedElement.value);
      if (path) {
        catalogDataNames.value = [catalog.name, ...path];
        return;
      }
    }
  }

  catalogDataNames.value = null;
}

watch(() => selectedElement.value, () => findCatalogDataNames());

</script>

<style lang="scss" scoped>
.form-select-service {
  &__content {
    padding: var(--spacing-sm);
  }

  &__loader,
  &__tree {
    height: 350px;
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
