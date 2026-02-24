<template>
  <call-transfer-container
    show-status
    show-user-name-avatar
    type="user"
    :size="size"
    :data-filters="dataFilters"
    :data-fields="dataFields"
    :get-data="getUsers"
    :presence-status-field="PresenceStatusField"
    @transfer="transfer"
  >
    <template #actions="{ item }">
      <wt-rounded-action
        color="transfer"
        :icon="`${state}-transfer--filled`"
        rounded
        @click="transfer(item)"
      />
    </template>
  </call-transfer-container>
</template>

<script setup lang="ts">
import { AgentsAPI } from '@webitel/api-services/api';
import { ApiUser } from '@webitel/api-services/gen';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useUserinfoStore } from '../../../../../../userinfo/userinfoStore';
import CallTransferContainer from '../_shared/components/call-transfer-container.vue';
import { TransferParams } from '../types/transfer-tabs';

interface APIResponse {
	items: ApiUser[];
	next: boolean;
	[key: string]: any;
}

interface Props {
	size?: ComponentSize;
}

const props = withDefaults(defineProps<Props>(), {
	size: ComponentSize.MD,
});

const store = useStore();

const PresenceStatusField = 'presence';
const dataSort = ref('position');
const dataFields = ref([
	'name',
	'id',
	'extension',
	'presence',
]);

const userinfoStore = useUserinfoStore();
const { userId } = storeToRefs(userinfoStore);
const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const scroll = computed(
	() =>
		store.state.scroll || {
			dataSearch: {
				value: '',
			},
		},
);

const emit = defineEmits([
  'transfer-complete',
]);

const transfer = async (item: UserItem = {} as UserItem) => {
	const number = item.extension || scroll.value.dataSearch?.value;
  await store.dispatch('features/call/BLIND_TRANSFER', number);
  emit('transfer-complete');
};

const getUsers = (params: TransferParams): Promise<APIResponse> => {
	return AgentsAPI.getUsersStatus({
		...params,
		notUserId: userId.value,
		sort: dataSort.value,
	});
};
</script>
<style scoped lang="scss">

</style>
