<template>
  <lookup-item-container
    :search="dataSearch"
    :loading="isLoading"
    :empty="!dataList.length"
    @search:input="dataSearch = $event"
    @search:change="resetData"
    @more="handleIntersect"
  >
    <template #empty>
      <empty-search type="contacts" />
    </template>
    <template #content>
      <user-lookup-item
        v-for="(item) of dataList"
        :key="item.id"
        :item="item"
        :size="size"
        @input="makeCall({ number: item.extension })"
      ></user-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script setup>
import { useStore } from 'vuex';

import APIRepository from '../../../../../../../../app/api/APIRepository';
import useInfiniteScroll from '../../../../../../../../app/composables/useInfiniteScroll.js';
import UserLookupItem from '../../../../_shared/components/lookup-item/user-lookup-item.vue';
import LookupItemContainer from '../../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../../_shared/components/workspace-empty-search/components/empty-search.vue';

const usersAPI = APIRepository.users;

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const fetchFn = usersAPI.getUsers;

const {
  dataList,
  isLoading,
  dataSearch,
  handleIntersect,
  resetData,
} = useInfiniteScroll({
  fetchFn,
  size: 20,
  sort: 'presence.status',
  fields: ['name', 'id', 'extension', 'presence', 'username'],
});

const makeCall = (item) => {
  store.dispatch('features/call/CALL', item);
};
</script>

<style lang="scss" scoped>

</style>
