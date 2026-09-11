<template>
  <call-transfer-container
    type="dialplan"
    :get-data="getDialplans"
  >
    <template #avatar>
      <wt-icon icon="bot" />
    </template>
    <template #actions="{ item }">
      <wt-rounded-action
        color="transfer"
        icon="call-transfer--filled"
        :tooltip="$t('transfer.blindTransfer')"
        rounded
        :loading="showLoader(item.id)"
        @click="transfer(item)"
      />
    </template>
  </call-transfer-container>
</template>

<script setup lang="ts">
import { DialplansAPI } from '@webitel/api-services/api';
import { EngineListRoutingOutboundCall } from '@webitel/api-services/gen';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useLoader } from '../../../../../../../composables/useLoader';
import CallTransferContainer from '../_shared/components/call-transfer-container.vue';
import blindTransferDialplan from '../_shared/utils/blindTransferDialplan';
import { TransferParams } from '../types/transfer-tabs';

const store = useStore();
const { showLoader, runWithLoader } = useLoader();

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const emit = defineEmits([
	'transfer-complete',
]);

const transfer = async (item) => {
	if (call.value) {
		await runWithLoader(item.id, () =>
			blindTransferDialplan(call.value, Number(item.schema.id)),
		);
		emit('transfer-complete');
	}
};

const getDialplans = (
	params: TransferParams,
): Promise<EngineListRoutingOutboundCall> => {
	return DialplansAPI.getList({
		...params,
		allowTransfer: true,
	});
};
</script>
