<template>
  <section class="flows">
    <ul v-show="isLoaded">
      <li
        v-for="(flow) in flowsList"
        :key="flow.id"
        class="flow-item"
      >
        <div class="flow-item__wrapper">
          <span class="flow-item__name"> {{ flow.name }} </span>
          <flow-button :id="flow.id" />
        </div>
        <wt-divider />
      </li>

    </ul>
  </section>
</template>

<script setup>
import { mapState, useStore } from 'vuex';
import { watchOnce } from '@vueuse/core';
// import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { computed, ref, defineProps, onMounted } from 'vue';
import FlowsAPI from '../api/flows.js';
// import infoSec from '../../../store/infoSec';
// import agentInfo from '../../general-info/store/agent-info';
import FlowButton from './flow-button.vue';

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


async function loadFlowsList(id) {
  const { items } = await FlowsAPI.getList({ teamId: id });
  flowsList.value = items;
  isLoaded.value = true;
}

if (team.value.id) loadFlowsList(team.value.id);

// onMounted(() => {
//   console.log('onMounted team.id', team.id);
//
//   isLoaded.value = true;
// });

</script>

<style lang="scss" scoped>
.flows {
  @extend %wt-scrollbar;

  .flow-item {

    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xs);
    }



      &__name {
        @extend %typo-body-1;
        overflow-wrap: break-word;
        word-break: break-all;
        text-transform: capitalize;
      }
  }
  //max-height: 100%;
  //min-height: 0;
  //overflow: auto;
  //word-break: break-all;
}
</style>
