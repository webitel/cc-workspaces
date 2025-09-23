<template>
  <call-transfer-container
    showStatus
    showUserNameAvatar
    :dataFilters="dataFilters"
    :dataFields="dataFields"
    :getData="getUsers"
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
import APIRepository from '../../../../../../../../../app/api/APIRepository';
import CallTransferContainer from '../../call-transfer-container.vue';


const usersAPI = APIRepository.users;

const dataFilters = ref('presence.status=sip,!dnd');
const dataSort = ref('presence.status');
const dataFields = ref(['name', 'id', 'extension', 'presence']);

const store = useStore();

const userId = computed(() => store.state['ui/userinfo']?.userId);
const state = computed(() => store.getters['workspace/WORKSRACE_STATE']);
const transfer = (item = {}) => {
  const number = item.extension || scroll.dataSearch.value;

  store.dispatch('features/call/BLIND_TRANSFER', number);
};

const getUsers = (params) => {
  return usersAPI.getUsers({ ...params, notId: [userId.value], staus: dataSort });
}
</script>
<style scoped lang="scss">

</style>
