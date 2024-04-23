<template>
  <section class="flow">
    FLOW
    {{ team }}
    {{ isLoaded ? '!!!!!!!!!!' : '((('}}
    <ul v-show="isLoaded">
      <li
        v-for="(flow) in flowsList"
        :key="flow.id"
        class="agent-pause-causes-item"
      >
        {{ flow.name }}
      </li>

    </ul>
  </section>
</template>

<script setup>
import { mapState, useStore } from 'vuex';
import { watchOnce } from '@vueuse/core';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { computed, ref, defineProps, onMounted } from 'vue';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import FlowsAPI from '../api/flow';
import infoSec from '../../../store/infoSec';
import agentInfo from '../../general-info/store/agent-info';

const props = defineProps({
  // size: {
  //   type: String,
  //   default: 'md',
  // },
});

const namespace = 'ui/infoSec/flow';
const agentNamespace = 'ui/infoSec/agentInfo';

const store = useStore();
const isLoaded = ref(false);
const flowsList = ref([]);

const team = computed(() => store.getters["ui/infoSec/agentInfo/AGENT_TEAM"]);

console.log('team:', team);

async function loadFlowsList(id) {
  console.log('loadFlowsList', id)
  const { items } = await FlowsAPI.getList({ teamId: id });
  flowsList.value = items;
  isLoaded.value = true;
}

if(team.value.id) loadFlowsList(team.value.id);

// onMounted(() => {
//   console.log('onMounted team.id', team.id);
//
//   isLoaded.value = true;
// });

</script>

<style lang="scss" scoped>
.flow {
  @extend %wt-scrollbar;
  //max-height: 100%;
  //min-height: 0;
  //overflow: auto;
  //word-break: break-all;
}
</style>
