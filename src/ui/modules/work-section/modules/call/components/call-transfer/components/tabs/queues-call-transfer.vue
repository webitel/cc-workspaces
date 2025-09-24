<template>
  <call-transfer-container
    :getData="getQueues"
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
import APIRepository from '../../../../../../../../../app/api/APIRepository';
import CallTransferContainer from '../_shared/components/call-transfer-container.vue';
import { EngineQueue } from 'webitel-sdk';
import { TransferParams } from '../../types/transfer-tabs';


interface APIResponse {
  items: EngineQueue[];
  next: boolean;
  [key: string]: any;
}

interface CLI {
  allCall: () => Array<{
    blindTransferQueue: (queueId: number) => void;
    processTransferQueue: (queueId: number) => void;
  }>;
}

const store = useStore();
const queuesAPI = APIRepository.queues;

const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);
const cli = computed(() => store.state.cli as CLI);

const transfer = (item: QueueItem = {} as QueueItem) => {
  const calls = cli.value?.allCall?.();
  if (calls && calls.length > 0) {
    return calls[0].blindTransferQueue(Number(item.id));
  }
};

const consultationTransfer = (item: QueueItem = {} as QueueItem) => {
  const calls = cli.value?.allCall?.();
  if (calls && calls.length > 0) {
    return calls[0].processTransferQueue(Number(item.id));
  }
};

const getQueues = (params: TransferParams): Promise<APIResponse> => {
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
