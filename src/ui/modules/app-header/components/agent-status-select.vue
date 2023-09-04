<template>
  <wt-cc-agent-status-select
    class="agent-status-select"
    :agent-id="agent.agentId"
    :status="agent.status"
    :status-duration="statusDuration"
  ></wt-cc-agent-status-select>
</template>

<script>
import { mapState } from 'vuex';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import WtCcAgentStatusSelect from '@webitel/ui-sdk/src/modules/AgentStatusSelect/components/wt-cc-agent-status-select.vue';

export default {
  name: 'agent-status-select',
  components: {
    WtCcAgentStatusSelect,
  },

  computed: {
    ...mapState('ui/now', {
      now: (state) => state.now,
    }),

    ...mapState('features/status', {
      agent: (state) => state.agent,
    }),

    statusDuration() {
      let time = this.now - (this.agent.lastStatusChange || Date.now());
      time = time < 0 ? 0 : time;
      return convertDuration(time / 1000);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
