<template>
  <call-transfer-container
    show-team-name
    type="agent"
    show-status
    :data-fields="dataFields"
    :data-filters="dataFilters"
    :get-data="getAgens"
    :presence-status-field="PresenceStatusField"
    @transfer="consultationTransfer"
  >
    <template #actions="{ item }">
      <wt-rounded-action
        color="transfer"
        icon="consultative-transfer"
        rounded
        @click="consultationTransfer(item)"
      />
    </template>
  </call-transfer-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import APIRepository from '../../../../../../../../app/api/APIRepository';
import CallTransferContainer from '../_shared/components/call-transfer-container.vue';
import { EngineAgent } from '@webitel/api-services/gen';
import { TransferParams } from '../types/transfer-tabs';

interface APIResponse {
  items: EngineAgent[];
  next: boolean;
  [key: string]: any;
}

const store = useStore();
const agentsAPI = APIRepository.agents;
const PresenceStatusField = 'userPresenceStatus'

const dataFields = ['status', 'user_presence_status', 'name', 'extension', 'team'];
const dataFilters = 'user_presence_status.status=sip,!dnd';
const dataSort = 'position';

const scroll = computed(() => store.state.scroll || { dataSearch: { value: '' } });

const consultationTransfer = (item: AgentItem = {} as AgentItem) => {
  const number = item.extension || scroll.value.dataSearch?.value;
  store.dispatch('features/call/TOGGLE_HOLD', item.id);
  store.dispatch('features/call/CALL', {
    user: store.state.ui.userinfo,
    number
  });
};

const getAgens = (params: TransferParams): Promise<APIResponse> => {
  return agentsAPI.getList({ ...params, enabled: true, sort: dataSort.value});
};
</script>
<style scoped lang="scss">

</style>
