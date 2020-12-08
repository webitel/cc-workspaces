<template>
  <wt-status-select
    :status="status"
    :status-duration="duration"
    :options="options"
    @change="changeStatus"
  ></wt-status-select>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import UserStatus from '../../../store/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'status-select',

  computed: {
    ...mapState('now', {
      now: (state) => state.now,
    }),

    ...mapState('status', {
      agent: (state) => state.agent,
      user: (state) => state.user,
    }),

    ...mapGetters('status', {
      isAgent: 'IS_AGENT',
    }),

    duration() {
      const changeTime = this.isAgent
        ? this.agent.lastStatusChange : this.user.lastStateChange;
      let time = this.now - (changeTime || Date.now());
      time = time < 0 ? 0 : time;
      return convertDuration(time / 1000);
    },

    status() {
      const { status } = this.isAgent ? this.agent : this.user;
      return status;
    },

    agentOptions() {
      return [
        {
          color: 'success',
          text: this.$t('agentStatus.status.active'),
          value: AgentStatus.Online,
        },
        {
          color: 'primary',
          text: this.$t('agentStatus.status.break'),
          value: AgentStatus.Pause,
        },
      ];
    },
    userOptions() {
      return [
        {
          color: 'success',
          text: this.$t('agentStatus.status.active'),
          value: UserStatus.ACTIVE,
        },
        {
          color: 'primary',
          text: this.$t('agentStatus.status.dnd'),
          value: UserStatus.DND,
        },
      ];
    },
    options() {
      return this.isAgent ? this.agentOptions : this.userOptions;
    },
  },

  methods: {
    changeStatus(status) {
      if (this.isAgent) {
        switch (status) {
          case AgentStatus.Online:
            this.setAgentWaiting();
            break;
          case AgentStatus.Pause:
            this.$emit('setBreak'); // opens break reason popup
            break;
          default:
        }
      } else {
        switch (status) {
          case UserStatus.ACTIVE:
            this.setUserActive();
            break;
          case UserStatus.DND:
            this.setUserDnd();
            break;
          default:
        }
      }
    },

    ...mapActions('status', {
      setAgentWaiting: 'SET_AGENT_WAITING_STATUS',
      agentLogout: 'AGENT_LOGOUT',
      setUserActive: 'SET_USER_ACTIVE_STATUS',
      setUserDnd: 'SET_USER_DND_STATUS',
    }),
  },
};
</script>

<style lang="scss" scoped>
.wt-status-select {
  width: 150px;
}
</style>
