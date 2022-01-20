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
import WtCcAgentStatusSelect
  from '@webitel/cc-ui-sdk/src/packages/wt-cc-agent-status-select/components/wt-cc-agent-status-select.vue';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';

export default {
  name: 'agent-status-select',
  components: {
    WtCcAgentStatusSelect,
  },

  computed: {
    ...mapState('now', {
      now: (state) => state.now,
    }),

    ...mapState('status', {
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
