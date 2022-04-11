<template>
  <section class="general-info">
    <wt-loader v-show="!isLoaded"></wt-loader>
    <div class="general-info__content-wrapper" v-show="isLoaded">
      <wt-cc-agent-status-timers
        class="general-info__article"
        :status="agentInfo.agent"
      ></wt-cc-agent-status-timers>
      <agent-queues
        v-if="agentInfo.queues.length"
        class="general-info__article general-info__article--padded general-info__article--outlined"
        :queues="agentInfo.queues"
      ></agent-queues>
      <agent-org-structure
        class="general-info__article"
        :agent="agentInfo.agent"
      ></agent-org-structure>
      <agent-pause-causes
        v-if="agentInfo.pauseCauses.length"
        class="general-info__article general-info__article--padded general-info__article--outlined"
        :pause-causes="agentInfo.pauseCauses"
      ></agent-pause-causes>
    </div>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
  import autoRefreshMixin from '@webitel/cc-ui-sdk/src/mixins/autoRefresh/autoRefreshMixin';
  import AgentOrgStructure from './agent-org-structure.vue';
  import AgentQueues from './agent-queues.vue';
  import AgentPauseCauses from './agent-pause-causes.vue';

  export default {
    name: 'general-info-tab',
    mixins: [autoRefreshMixin],
    components: { AgentOrgStructure, AgentQueues, AgentPauseCauses },
    data: () => ({
      namespace: 'agentInfo',
      isLoaded: false,
    }),
    watch: {
      agent: { // wait for agent to load to get agentId
        async handler() {
          if (this.agent) await this.loadAgentInfo();
        },
        immediate: true,
      },
    },
    computed: {
      ...mapState('status', {
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
      async makeAutoRefresh() {
        return this.loadAgentInfo();
      },
    },
  };
</script>

<style lang="scss" scoped>
.general-info {
  @extend %wt-scrollbar;
  position: relative;
  overflow: scroll;

  .wt-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.general-info__article {
  margin-top: var(--spacing-sm);

  &--padded {
    padding: var(--spacing-sm);
  }

  &--outlined {
    border: 1px solid var(--secondary-color);
    border-radius: var(--border-radius);
  }
}
.wt-cc-agent-status-timers {
  justify-content: center;
}
</style>
