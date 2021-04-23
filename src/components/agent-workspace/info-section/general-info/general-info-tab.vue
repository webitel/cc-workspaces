<template>
  <section class="general-info">
    <agent-status-timers :status="state.status"></agent-status-timers>
    <agent-org-structure :agent="agent"></agent-org-structure>
    <section class="agent-queues">
      <ul>
        <li
          v-for="(queue) of state.queues"
          :key="queue.queue.id"
        >
          {{ queue.queue.name }} <strong>waiting</strong><wt-badge>{{ queue.waitingMembers }}</wt-badge>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
  import AgentStatusTimers from './agent-status-timers.vue';
  import AgentOrgStructure from './agent-org-structure.vue';

  export default {
    name: 'general-info-tab',
    components: { AgentStatusTimers, AgentOrgStructure },
    data: () => ({
      namespace: 'agentInfo',
    }),
    watch: {
      agent() { // wait for agent to load to get agentId
        this.loadAgentInfo();
      },
    },
    computed: {
      ...mapState('status', {
        agent: (state) => state.agent,
      }),
      ...mapState({
        state(state) {
          return getNamespacedState(state, this.namespace);
        },
      }),
    },
    methods: {
      ...mapActions({
        loadAgentInfo(dispatch, payload) {
          return dispatch(`${this.namespace}/LOAD_AGENT_INFO`, payload);
        },
      }),
    },
  };
</script>

<style lang="scss" scoped>
</style>
