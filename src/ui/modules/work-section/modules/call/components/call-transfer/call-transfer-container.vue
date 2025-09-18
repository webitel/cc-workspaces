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
        :key="`${item.id}${key}`"
        :item="item"
        :size="size"
        :showStatus
        :showTeamName
        :showUserNameAvatar
      >
        <template #actions="{ item }">
          <wt-rounded-action
            v-if="showTransferButton"
            color="transfer"
            :icon="`${state}-transfer--filled`"
            rounded
            @click="transfer(item)"
          />
          <wt-rounded-action
            v-if="showConsultationTransfer"
            color="transfer"
            icon="consultative-transfer"
            rounded
            @click="consultation(item)"
          />
        </template>
      </transfer-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import APIRepository from '../../../../../../../app/api/APIRepository';
import useInfiniteScroll from '../../../../../../../app/composables/useInfiniteScroll';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import CallTransferTabs from './tabs/call-transfer-tabs.vue';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';

const props = defineProps({
  size: {
    type: String,
    default: '',
  },
  currentTab: {
    type: String,
    default: 'users',
  },
});

const usersAPI = APIRepository.users;
const agentsAPI = APIRepository.agents;
const queuesAPI = APIRepository.queues;

const store = useStore();
const { t } = useI18n();

const dataFilters = ref('presence.status=sip,!dnd');
const dataSort = ref('presence.status');
const dataFields = ref(['name', 'id', 'extension', 'presence']);

const userId = computed(() => store.state['ui/userinfo']?.userId);
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);
const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);

const scroll = useInfiniteScroll({
  filters: dataFilters.value,
  fields: dataFields.value,
  fetchFn: (params) => {
    if (props.currentTab === 'agents') {
      return agentsAPI.getList({ ...params, enabled: true });
    } else if (props.currentTab === 'queues') {
      if (!agentId.value) return Promise.resolve({ items: [], next: false });
      return queuesAPI.getList({
        ...params,
        parentId: agentId.value,
      });
    }
    return usersAPI.getUsers({ ...params, notId: [userId.value], staus: dataSort });
  },
});


const isTransferToNumberDisabled = computed(() => !scroll.dataSearch.value);


const showTransferButton = computed(() => props.currentTab === 'users' || props.currentTab === 'queues');
const showConsultationTransfer = computed(() => props.currentTab === 'queues' || props.currentTab === 'agents');
const showStatus = computed(() => props.currentTab === 'users');
const showTeamName = computed(() => props.currentTab === 'agents');
const showUserNameAvatar = computed(() => props.currentTab === 'users');

const transfer = (item = {}) => {
  const number = item.extension || scroll.dataSearch.value;
  if (props.currentTab === 'queues') {
    return cli.allCall()[0].blindTransferQueue(Number(item.id))
  }
  store.dispatch('features/call/BLIND_TRANSFER', number);
};

const consultation = (item = {}) => {
  const number = item.extension || scroll.dataSearch.value;
  store.dispatch('features/call/TOGGLE_HOLD', item.id);
  if (props.currentTab === 'queues') {
    return cli.allCall()[0].processTransferQueue(Number(item.id));
  }
  store.dispatch('features/call/CALL', { user: store.state['ui/userinfo'], number });

}

const { dataList, dataSearch, isLoading, handleIntersect, resetData } = scroll;

watch(
  () => props.currentTab,
  () => {
    scroll.resetData();
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
</style>
