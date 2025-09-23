<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >
    <template #after-search>
      <wt-button
        color="transfer"
        :disabled="isTransferToNumberDisabled"
        @click="emit('transfer', { extension: dataSearch })"
      >{{ $t('transfer.transfer') }}
      </wt-button>
    </template>

    <template #empty>
      <empty-search type="contacts" />
    </template>

    <template #content>
      <transfer-lookup-item
        v-for="(item, key) of dataList"
        :key="`${item.id}${key}`"
        :item="item"
        :type="'user'"
        :size="size"
        :showStatus
        :showTeamName
        :showUserNameAvatar
      >
        <template #actions="{ item }">
          <slot name="actions" :item="item"/>
        </template>
      </transfer-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import useInfiniteScroll from '../../../../../../../app/composables/useInfiniteScroll';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';

interface CallTransferContainerProps {
  size?: string;
  getData: (params: any) => Promise<any>;
  showStatus?: boolean;
  showTeamName?: boolean;
  showUserNameAvatar?: boolean;
  dataFilters?: string;
  dataFields?: string[];
}

interface CallTransferContainerEmits {
  (e: 'transfer', item: any): void;
}

const props = withDefaults(defineProps<CallTransferContainerProps>(), {
  size: 'md',
  showStatus: false,
  showTeamName: false,
  showUserNameAvatar: false,
  dataFilters: '',
  dataFields: () => [],
});

const emit = defineEmits<CallTransferContainerEmits>();

const scroll = useInfiniteScroll({
  filters: props.dataFilters,
  fields: props.dataFields,
  fetchFn: (params) => props.getData(params)
});

const isTransferToNumberDisabled = computed(() => !scroll.dataSearch.value);

const { dataList, dataSearch, isLoading, handleIntersect, resetData } = scroll;


</script>

<style lang="scss" scoped>
</style>
