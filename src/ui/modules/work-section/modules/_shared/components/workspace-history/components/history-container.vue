<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="customHandleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template #empty>
      <empty-search type="history" />
    </template>

    <template #content>
      <div
        v-for="dataItem in dataList"
        class="history-container-contact">
        <p class="history-container-contact__caption">
          {{dataItem.groupName}}
        </p>
        <history-lookup-item
          v-for="(item) of dataItem.groupData"
          :key="item.id"
          :item="item"
          :size="size"
          :for-number="historyNumber"
          class="history-container-contact__item"
          @input="select(item)"
        />
        <wt-divider/>
      </div>

    </template>

  </lookup-item-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { CallDirection } from 'webitel-sdk';

import APIRepository from '../../../../../../../../app/api/APIRepository';
import useInfiniteScroll from '../../../../../../../../app/composables/useInfiniteScroll';
import WorkspaceStates from '../../../../../../../enums/WorkspaceState.enum';
import HistoryLookupItem from '../../lookup-item/history-lookup-item.vue';
import LookupItemContainer from '../../lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../workspace-empty-search/components/empty-search.vue';

const historyAPI = APIRepository.history;

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const { t } = useI18n();
const store = useStore();

const historyNumber = ref('');

const userId = computed(() => store.state.ui.userinfo?.userId);
const workspaceState = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const member = computed(() => store.getters['features/member/MEMBER_ON_WORKSPACE']);
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const select = (item) => {
  let destination = '';
  if (item.direction === CallDirection.Inbound) destination = item.from.number || '';
  if (item.direction === CallDirection.Outbound) destination = item.destination;
  store.dispatch('features/call/SET_NEW_NUMBER', { value: destination });
};

const getAgentHistory = (argParams) => {
  const params = {
    ...argParams,
    ownerId: userId.value,
  };
  return historyAPI.getHistory(params);
};

const getMemberHistory = (argParams) => {
  const params = {
    ...argParams,
    memberId: member.value.id,
  };
  return historyAPI.getHistory(params);
};

const resetHistoryNumber = () => {
  historyNumber.value = '';
};

const groupAndSortByDate = (data) => {
  const groupedData = {};
  data.forEach(item => {
    const date = new Date(parseInt(item.createdAt));
    let dateKey;

    isToday(date) ? dateKey = t('history.today') : dateKey = formatDate(item.createdAt);

    if (!groupedData[dateKey]) groupedData[dateKey] = [];
    groupedData[dateKey].push(item);
  });

  const result = Object.keys(groupedData).map(key => {
    return {
      groupName: key,
      groupData: groupedData[key].sort((a, b) => b.createdAt - a.createdAt)
    };
  });

  return result;
};

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
};

const fetchFn = async (argParams) => {
  let response;
  const params = { ...argParams };
  if (workspaceState.value === WorkspaceStates.MEMBER) {
    response = await getMemberHistory(params);
  } else {
    response = await getAgentHistory(params);
  }
  return response;
};

// Custom loadDataList with grouping
const loadDataListWithGrouping = async () => {
  if (dataPage.value === 1) isLoading.value = true;
  const params = collectParams();
  const { items, data, next } = await fetchFn(params);
  isNext.value = next;

  const rawData = items || data || [];
  const sortedData = groupAndSortByDate(rawData);
  setData(sortedData)

  dataPage.value += 1;
  isLoading.value = false;
};

const {
  dataList,
  isLoading,
  dataSearch,
  handleIntersect,
  dataPage,
  isNext,
  setData,
  collectParams,
} = useInfiniteScroll({
  fetchFn,
  size: 20,
  fields: ['id', 'parent_id', 'from', 'to', 'created_at', 'destination', 'duration', 'direction', 'answered_at', 'contact'],
});

// Custom reset that handles data properly
const resetData = async () => {
  isNext.value = false;
  dataPage.value = 1;
  dataList.value = [];
  await loadDataListWithGrouping();
};

// Override handleIntersect to use custom loadDataList
const customHandleIntersect = async () => {
  if (!isNext.value) return;
  await loadDataListWithGrouping();
};

watch(call, () => {
  resetHistoryNumber();
});
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.history-container-contact{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs);
    padding-top: var(--spacing-2xs);

    &__caption{
      @extend %typo-caption;
      text-align: center;
    }
  }
</style>

