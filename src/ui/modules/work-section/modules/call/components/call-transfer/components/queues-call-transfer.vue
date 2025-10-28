<template>
  <call-transfer-container
    :get-data="getQueues"
    :size
    type="queue"
  >
    <template #avatar>
      <wt-icon
        icon="bot"
        :size="size"
      ></wt-icon>
    </template>
    <template #actions="{ item }">
      <wt-rounded-action
        color="transfer"
        :icon="`${state}-transfer--filled`"
        rounded
        @click="transfer(item)"
      />
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
import { EngineListQueue } from '@webitel/api-services/gen';
import { TransferParams } from '../types/transfer-tabs';


const store = useStore();
const queuesAPI = APIRepository.queues;

const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const transfer = (item: QueueItem = {} as QueueItem) => {
  if (call) {
    return call.value.blindTransferQueue(Number(item.id));
  }
};

const consultationTransfer = (item: QueueItem = {} as QueueItem) => {
  if (call) {
    return call.value.processTransferQueue(Number(item.id));
  }
};

const getQueues = (params: TransferParams): Promise<EngineListQueue> => {
  if (!agentId.value) {
    return Promise.resolve({ items: [], next: false });
  }

  return queuesAPI.getList({
    ...params,
    parentId: agentId.value,
  });
};
</script>
<style scoped lang="scss">

</style>
