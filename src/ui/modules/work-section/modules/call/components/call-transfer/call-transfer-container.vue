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
        @click="transfer"
      >{{ $t('transfer.transfer') }}
      </wt-button>
    </template>

    <template #empty>
      <empty-search type="contacts" />
    </template>

    <template #content>
      <transfer-lookup-item
        v-for="(item, key) of dataList"
        :id="`scroll-item-${key}`"
        :key="`${item.id}${key}`"
        :item="item"
        :size="size"
        @input="transfer"
      ></transfer-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import APIRepository from '../../../../../../../app/api/APIRepository';
import useInfiniteScroll from '../../../../../../../app/composables/useInfiniteScroll.js';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';

const usersAPI = APIRepository.users;

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const userId = computed(() => store.state['ui/userinfo']?.userId);

const fetchFn = (params) => {
  return usersAPI.getUsers({
    ...params,
    notId: [userId.value],
    filters: 'presence.status=sip,!dnd',
    sort: 'presence.status',
    fields: ['name', 'id', 'extension', 'presence'],
  });
};

const {
  dataList,
  isLoading,
  dataSearch,
  handleIntersect,
  resetData,
} = useInfiniteScroll({
  fetchFn,
  size: 20,
});

const isTransferToNumberDisabled = computed(() => !dataSearch.value);

const transfer = (item = {}) => {
  const number = item.extension || dataSearch.value;
  store.dispatch('features/call/BLIND_TRANSFER', number);
};
</script>

<style lang="scss" scoped>
</style>
