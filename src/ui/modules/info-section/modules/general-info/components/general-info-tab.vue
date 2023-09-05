<template>
  <section class="general-info">
    <div v-show="isLoaded" class="general-info__content-wrapper">
      <wt-cc-agent-status-timers
        :size="size"
        :status="agentInfo.agent"
        class="general-info__article"
      ></wt-cc-agent-status-timers>
      <agent-queues
        v-if="agentInfo.queues.length"
        :queues="agentInfo.queues"
        :size="size"
        class="general-info__article"
      ></agent-queues>
      <agent-org-structure
        :agent="agentInfo.agent"
        :size="size"
        class="general-info__article"
      ></agent-org-structure>
      <agent-pause-causes
        v-if="agentInfo.pauseCauses.length"
        :pause-causes="agentInfo.pauseCauses"
        :size="size"
        class="general-info__article"
      ></agent-pause-causes>
      <agent-score
        :score="{
          scoreCount: agentInfo.agent.scoreCount,
          scoreAvg: agentInfo.agent.scoreRequiredAvg,
        }"
        :size="size"
        class="general-info__article"
      ></agent-score>
    </div>
  </section>
</template>

<script>
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import WtCcAgentStatusTimers from '@webitel/ui-sdk/src/components/on-demand/wt-cc-agent-status-timers/wt-cc-agent-status-timers.vue';
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval';
import { mapActions, mapState } from 'vuex';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import AgentScore from './agent-score.vue';
import AgentOrgStructure from './agent-org-structure.vue';
import AgentPauseCauses from './agent-pause-causes.vue';
import AgentQueues from './agent-queues.vue';

export default {
  name: 'general-info-tab',
  mixins: [sizeMixin],
  components: {
    AgentScore,
    AgentOrgStructure,
    AgentQueues,
    AgentPauseCauses,
    WtCcAgentStatusTimers,
  },
  data: () => ({
    namespace: 'ui/infoSec/agentInfo',
    isLoaded: false,
  }),
  setup() {
    const { subscribe } = useCachedInterval({ timeout: 5 * 1000 });
    return { subscribe };
  },
  watch: {
    agent: { // wait for agent to load to get agentId
      async handler() {
        if (this.agent) await this.loadAgentInfo();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState('features/status', {
      agent: (state) => state.agent,
    }),
    ...mapState({
                  agentInfo(state) {
                    return getNamespacedState(state, this.namespace);
                  },
                }),
  },
  methods: {
    ...mapActions({
                    dispatchLoadAgentInfo(dispatch, payload) {
                      return dispatch(`${this.namespace}/LOAD_AGENT_INFO`, payload);
                    },
                  }),
    async loadAgentInfo(payload) {
      await this.dispatchLoadAgentInfo(payload);
      this.isLoaded = true;
    },
  },
  mounted() {
    this.subscribe(this.loadAgentInfo);
  },
};
</script>

<style lang="scss" scoped>
.general-info {
  position: relative;
  overflow: scroll;

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
