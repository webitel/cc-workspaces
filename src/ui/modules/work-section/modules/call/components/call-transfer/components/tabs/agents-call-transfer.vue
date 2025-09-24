<template>
  <call-transfer-container
    showTeamName
    type="agent"
    :getData="getAgens"
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
import APIRepository from '../../../../../../../../../app/api/APIRepository';
import CallTransferContainer from '../call-transfer-container.vue';
import { EngineAgent } from 'webitel-sdk';
import { TransferParams } from '../../types/transfer-tabs';

interface APIResponse {
  items: EngineAgent[];
  next: boolean;
  [key: string]: any;
}

const store = useStore();
const agentsAPI = APIRepository.agents;

const scroll = computed(() => store.state.scroll || { dataSearch: { value: '' } });

const consultationTransfer = (item: AgentItem = {} as AgentItem) => {
  const number = item.extension || scroll.value.dataSearch?.value;
  store.dispatch('features/call/TOGGLE_HOLD', item.id);
  store.dispatch('features/call/CALL', {
    user: store.state['ui/userinfo'],
    number
  });
};

const getAgens = (params: TransferParams): Promise<APIResponse> => {
  return agentsAPI.getList({ ...params, enabled: true });
};
</script>
<style scoped lang="scss">

</style>
