<template>
  <section class="general-info">
    <wt-loader v-show="!isLoaded"></wt-loader>
    <div class="general-info__content-wrapper" v-show="isLoaded">
      <wt-cc-agent-status-timers
        class="general-info__article"
        :class="[`agent-status-timer--${size}`]"
        :status="agentInfo.agent"
        :size="size"
      ></wt-cc-agent-status-timers>
      <agent-queues
        v-if="agentInfo.queues.length"
        class="general-info__article general-info__article--padded general-info__article--outlined"
        :queues="agentInfo.queues"
        :size="size"
      ></agent-queues>
      <agent-org-structure
        class="general-info__article general-info__article--padded general-info__article--outlined"
        :agent="agentInfo.agent"
        :size="size"
      ></agent-org-structure>
      <agent-pause-causes
        v-if="agentInfo.pauseCauses.length"
        class="general-info__article general-info__article--padded general-info__article--outlined"
        :pause-causes="agentInfo.pauseCauses"
        :size="size"
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
  import sizeMixin from '../../../../../../app/mixins/sizeMixin';

  export default {
    name: 'general-info-tab',
    mixins: [autoRefreshMixin, sizeMixin],
    components: { AgentOrgStructure, AgentQueues, AgentPauseCauses },
    data: () => ({
      namespace: 'ui/infoSec/agentInfo',
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
  justify-content: center;

  &--padded {
    padding: var(--spacing-2xs);
  }

  &--outlined {
    border: 1px solid var(--secondary-color);
    border-radius: var(--border-radius);
  }
}
.agent-status-timer--sm {
  @extend %typo-subtitle-2;
  padding: calc(var(--spacing-xs) * 2);
  border: 1px solid var(--secondary-color);
  justify-content: space-between;
}
</style>
