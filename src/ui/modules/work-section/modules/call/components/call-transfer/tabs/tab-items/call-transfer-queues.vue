<template>
  <call-transfer-container
    :getData="getQueues"
  >
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
        @click="consultation(item)"
      />
    </template>
  </call-transfer-container>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import APIRepository from '../../../../../../../../../app/api/APIRepository';
import callTransferContainer from '../../call-transfer-container.vue';

const queuesAPI = APIRepository.queues;

const store = useStore();
const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const agentId = computed(() => store.state?.features?.status?.agent?.agentId);
const transfer = (item = {}) => {
  return cli.allCall()[0].blindTransferQueue(Number(item.id))
};

const consultation = (item = {}) => {
  return cli.allCall()[0].processTransferQueue(Number(item.id));
}

const getQueues = (params) => {
  if (!agentId.value) return Promise.resolve({ items: [], next: false });
  return queuesAPI.getList({
    ...params,
    parentId: agentId.value,
  });
}
</script>
<style scoped lang="scss">

</style>
