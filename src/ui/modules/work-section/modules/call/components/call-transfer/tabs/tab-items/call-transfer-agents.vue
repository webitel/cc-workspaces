<template>
  <call-transfer-container
    showTeamName
    :getData="getAgens"
    @transfer="consultation"
  >
    <template #actions="{ item }">
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
import APIRepository from '../../../../../../../../../app/api/APIRepository';
import callTransferContainer from '../../call-transfer-container.vue';

const agentsAPI = APIRepository.agents;

const consultation = (item = {}) => {
  const number = item.extension || scroll.dataSearch.value;
  store.dispatch('features/call/TOGGLE_HOLD', item.id);
  store.dispatch('features/call/CALL', { user: store.state['ui/userinfo'], number });
}

const getAgens = (params) => {
  return agentsAPI.getList({ ...params, enabled: true });
}
</script>
<style scoped lang="scss">

</style>
