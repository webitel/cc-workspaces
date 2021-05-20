<template>
  <wt-status-select
    class="user-status-select"
    :status="user.status"
    :status-duration="duration"
    :options="options"
    @change="changeStatus"
  ></wt-status-select>
</template>

<script>
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { mapActions, mapState } from 'vuex';
import UserStatus from '../../../store/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'user-status-select',

  computed: {
    ...mapState('now', {
      now: (state) => state.now,
    }),

    ...mapState('status', {
      user: (state) => state.user,
    }),

    duration() {
      let time = this.now - (this.user.lastStateChange || Date.now());
      time = time < 0 ? 0 : time;
      return convertDuration(time / 1000);
    },

    options() {
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
  },

  methods: {
    ...mapActions('status', {
      setUserActive: 'SET_USER_ACTIVE_STATUS',
      setUserDnd: 'SET_USER_DND_STATUS',
    }),

    changeStatus(status) {
      switch (status) {
        case UserStatus.ACTIVE:
          this.setUserActive();
          break;
        case UserStatus.DND:
          this.setUserDnd();
          break;
        default:
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
