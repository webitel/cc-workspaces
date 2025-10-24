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
        :type="type"
        :size="size"
        :show-status="showStatus"
        :show-team-name="showTeamName"
        :show-user-name-avatar="showUserNameAvatar"
        :presence-status-field="presenceStatusField"
      >
        <template #before>
          <slot name="avatar"/>
        </template>
        <template #actions="{ item }">
          <slot name="actions" :item="item"/>
        </template>
      </transfer-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import useInfiniteScroll from '../../../../../../../../../app/composables/useInfiniteScroll'
import LookupItemContainer from '../../../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import TransferLookupItem from '../../../../../_shared/components/lookup-item/transfer-lookup-item.vue';
import { transferParams } from '../../types/transfer-tabs'
import TransferDestination from '../../../../../chat/enums/ChatTransferDestination.enum.js'
import { ComponentSize } from '@webitel/ui-sdk/enums';

interface CallTransferContainerProps {
  size?: string;
  type: string;
  getData: (params: transferParams) => Promise<any>;
  showStatus?: boolean;
  showTeamName?: boolean;
  showUserNameAvatar?: boolean;
  dataFilters?: string;
  dataFields?: string[];
  presenceStatusField?: string;
}

interface CallTransferContainerEmits {
  (e: 'transfer', item: any): void;
}

const props = withDefaults(defineProps<CallTransferContainerProps>(), {
  size: ComponentSize.MD,
  type: TransferDestination.USER,
  showStatus: false,
  showTeamName: false,
  showUserNameAvatar: false,
  dataFilters: '',
  dataFields: () => [],
  presenceStatusField: 'presence'
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
