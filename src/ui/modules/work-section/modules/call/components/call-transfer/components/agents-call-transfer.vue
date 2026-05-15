<template>
  <call-transfer-container
    show-team-name
    type="agent"
    show-status
    :data-fields="dataFields"
    :data-filters="dataFilters"
    :get-data="getAgens"
    :presence-status-field="PresenceStatusField"
		:transfer-loading="currentTransferNumber && isLoading(currentTransferNumber)"
    @transfer="consultationTransfer"
  >
    <template #actions="{ item }">
      <wt-rounded-action
        color="transfer"
        icon="consultative-transfer"
        rounded
				:loading="isLoading(item.id)"
        @click="consultationTransfer(item)"
      />
    </template>
  </call-transfer-container>
</template>

<script setup lang="ts">
import { AgentsAPI } from '@webitel/api-services/api';
import { EngineAgent } from '@webitel/api-services/gen';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import APIRepository from '../../../../../../../../app/api/APIRepository';
import { useLoadingState } from '../../../../../../../composables/useLoadingState';
import { useUserinfoStore } from '../../../../../../userinfo/userinfoStore';
import CallTransferContainer from '../_shared/components/call-transfer-container.vue';
import { TransferParams } from '../types/transfer-tabs';

interface APIResponse {
	items: EngineAgent[];
	next: boolean;
	[key: string]: unknown;
}

const store = useStore();
const { isLoading, withLoading } = useLoadingState();

const agentsAPI = APIRepository.agents;
const PresenceStatusField = 'userPresenceStatus';

const dataFields = [
	'status',
	'user_presence_status',
	'name',
	'extension',
	'team',
	'id',
];
const dataFilters = 'user_presence_status.status=sip,!dnd';
const dataSort = 'position';

const currentTransferNumber = ref<string | null>(null);

const scroll = computed(
	() =>
		store.state.scroll || {
			dataSearch: {
				value: '',
			},
		},
);
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const userinfoStore = useUserinfoStore();
const { userId } = storeToRefs(userinfoStore);

const emit = defineEmits([
	'transfer-complete',
]);

const consultationTransfer = async (item: AgentItem = {} as AgentItem) => {
	await withLoading(item.id, () =>
		store.dispatch('features/call/TOGGLE_HOLD', item.id),
	);
	if (call.value) {
		currentTransferNumber.value = item.extension;
		await withLoading(item.extension, () =>
			call.value.processTransferAgent(Number(item.id)),
		);
		currentTransferNumber.value = null;
		emit('transfer-complete');
	}
};

const getAgens = (params: TransferParams): Promise<APIResponse> => {
	return AgentsAPI.getList({
		...params,
		enabled: true,
		sort: dataSort,
		notUserId: userId.value,
	});
};
</script>
<style scoped lang="scss">

</style>
