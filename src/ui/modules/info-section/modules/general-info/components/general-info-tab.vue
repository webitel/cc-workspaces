<template>
  <section class="general-info">
    <div v-show="isLoaded" class="general-info__content-wrapper">
      <wt-cc-agent-status-timers
        :size="props.size"
        :status="agentInfo.agent"
        class="general-info__article"
      ></wt-cc-agent-status-timers>
      <agent-queues
        v-if="agentInfo.queues.length"
        :queues="agentInfo.queues"
        :size="props.size"
        class="general-info__article"
      ></agent-queues>
      <agent-org-structure
        :agent="agentInfo.agent"
        :size="props.size"
        class="general-info__article"
      ></agent-org-structure>
      <agent-pause-causes
        v-if="agentInfo.pauseCauses.length"
        :pause-causes="agentInfo.pauseCauses"
        :size="props.size"
        class="general-info__article"
      ></agent-pause-causes>
      <agent-score
        :size="props.size"
        class="general-info__article"
      ></agent-score>
    </div>
  </section>
</template>

<script setup>
import { watchOnce } from '@vueuse/core';
import WtCcAgentStatusTimers
  from '@webitel/ui-sdk/src/components/on-demand/wt-cc-agent-status-timers/wt-cc-agent-status-timers.vue';
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

import AgentOrgStructure from './agent-org-structure.vue';
import AgentPauseCauses from './agent-pause-causes.vue';
import AgentQueues from './agent-queues.vue';
import AgentScore from './agent-score.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const namespace = 'ui/infoSec/agentInfo';

const store = useStore();
const isLoaded = ref(false);

const agent = computed(() => store.state.features.status.agent);
const agentInfo = computed(() => getNamespacedState(store.state, namespace));

const { subscribe } = useCachedInterval({ timeout: 5 * 1000 });

async function loadAgentInfo(payload) {
  await store.dispatch(`${namespace}/LOAD_AGENT_INFO`, payload);
  isLoaded.value = true;
}
watchOnce(agent, () => {
  subscribe(loadAgentInfo);
});

onMounted(() => {
  isLoaded.value = !!agent.value
})
</script>

<style lang="scss" scoped>
.general-info {
  position: relative;
  //overflow: scroll;

  .wt-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.general-info__content-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.general-info__article {
  justify-content: center;
}
</style>
