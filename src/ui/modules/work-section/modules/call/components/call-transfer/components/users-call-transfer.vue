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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import APIRepository from '../../../../../../../../app/api/APIRepository';
import CallTransferContainer from '../_shared/components/call-transfer-container.vue';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { ApiUser } from '@webitel/api-services/gen';
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
const usersAPI = APIRepository.users;

const PresenceStatusField = 'presence'
const dataFilters = ref('presence.status=sip,!dnd');
const dataSort = ref('presence.status');
const dataFields = ref(['name', 'id', 'extension', 'presence']);

const userId = computed(() => store.state['ui/userinfo']?.userId);
const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const scroll = computed(() => store.state.scroll || { dataSearch: { value: '' } });

const transfer = (item: UserItem = {} as UserItem) => {
  const number = item.extension || scroll.value.dataSearch?.value;
  store.dispatch('features/call/BLIND_TRANSFER', number);
};

const getUsers = (params: TransferParams): Promise<APIResponse> => {
  return usersAPI.getUsers({
    ...params,
    notId: [userId.value],
    staus: dataSort.value
  });
};
</script>
<style scoped lang="scss">

</style>
