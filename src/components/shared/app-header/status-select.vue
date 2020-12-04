<template>
  <wt-status-select
    :status="status"
    :status-duration="duration"
    @change="changeStatus"
  ></wt-status-select>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import UIStatus from '@webitel/ui-sdk/src/enums/AgentStatus/AgentStatus.enum';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import UserStatus from '../../../store/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'status-select',

  data: () => ({}),

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
      switch (status) {
        case AgentStatus.Online:
        case UserStatus.ACTIVE:
          return UIStatus.ONLINE;
        case AgentStatus.Pause:
        case UserStatus.DND:
          return UIStatus.PAUSE;
        case AgentStatus.Offline:
        case UserStatus.OFFLINE:
          return UIStatus.OFFLINE;
        default:
          return '';
      }
    },
  },

  methods: {
    changeStatus(status) {
      if (this.isAgent) {
        switch (status) {
          case UIStatus.ONLINE:
            this.setAgentWaiting();
            break;
          case UIStatus.PAUSE:
            this.$emit('setBreak'); // opens break reason popup
            break;
          default:
        }
      } else {
        switch (status) {
          case UIStatus.ONLINE:
            this.setUserActive();
            break;
          case UIStatus.PAUSE:
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
