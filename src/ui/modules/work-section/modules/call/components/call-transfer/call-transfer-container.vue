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
      <call-transfer-tabs
        :current-tab
        :data-list
        :size
        :tabs
        :show
        :showConsultationTransfer
        :showTransferButton
        @changeTab="changeTab"
        @transfer="transfer"
        @consultation="consultation"
      />
    </template>
  </lookup-item-container>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import APIRepository from '../../../../../../../app/api/APIRepository';
import useInfiniteScroll from '../../../../../../../app/composables/useInfiniteScroll';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import CallTransferTabs from './tabs/call-transfer-tabs.vue';

const props = defineProps({
  size: {
    type: String,
    default: '',
  },
});

const usersAPI = APIRepository.users;
const agentsAPI = APIRepository.agents;
const queuesAPI = APIRepository.queues;

const store = useStore();
const { t } = useI18n();

const currentTab = ref('users');
const dataFilters = ref('presence.status=sip,!dnd');
const dataSort = ref('presence.status');
const dataFields = ref(['name', 'id', 'extension', 'presence']);

const userId = computed(() => store.state['ui/userinfo']?.userId);
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);


const scroll = useInfiniteScroll({
  filters: dataFilters.value,
  sort: dataSort.value,
  fields: dataFields.value,
  fetchFn: (params) => {
    if (currentTab.value === 'agents') {
      return agentsAPI.getList({ enabled: true });
    } else if (currentTab.value === 'queues') {
      if (!agentId.value) return Promise.resolve({ items: [], next: false });
      return queuesAPI.getList({
        parentId: agentId.value,
        size: 100,
        fields: [],
      });
    }
    return usersAPI.getUsers({ ...params, notId: [userId.value] });
  },
});


const isTransferToNumberDisabled = computed(() => !scroll.dataSearch.value);

const tabs = computed(() => ([
  {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users',
  },
  {
    text: t('WebitelApplications.admin.sections.agents', 2),
    value: 'agents',
  },
  {
    text: t('WebitelApplications.admin.sections.queues', 2),
    value: 'queues',
  },
]));

const showTransferButton = computed(() => currentTab.value === 'users' || currentTab.value === 'queues');
const showConsultationTransfer = computed(() => currentTab.value === 'queues' || currentTab.value === 'agents');

const changeTab = (tab) => {
  currentTab.value = tab.value;
  scroll.resetData();
};

const transfer = (item = {}) => {
  const number = item.extension || scroll.dataSearch.value;
  store.dispatch('features/call/BLIND_TRANSFER', number);
};

const consultation = (item = {}) => {
  const number = item.extension || scroll.dataSearch.value;
  store.dispatch('features/call/TOGGLE_HOLD', item.id);
  store.dispatch('features/call/CALL', { user: store.state['ui/userinfo'], number });
}

const { dataList, dataSearch, isLoading, handleIntersect, resetData } = scroll;
</script>

<style lang="scss" scoped>
</style>
