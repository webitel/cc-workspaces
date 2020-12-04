<template>
  <div
    class="status-select"
    :class="{'opened': isOpened}"
    tabindex="0"
    @keypress.enter="isOpened = !isOpened"
    v-clickaway="close"
  >
    <div
      class="status-select__item status-select__item__selected"
      :class="{'hidden': isOpened}"
      @click="isOpened = true"
    >
        <span
          class="status-select__indicator"
          :class="computeCurrentStatusIndicatorClass"
        ></span>
      <div class="status-select__item__text">{{ duration }}</div>
      <icon class="status-select__arrow">
        <svg class="icon icon-arrow-down-md md">
          <use xlink:href="#icon-arrow-down-md"></use>
        </svg>
      </icon>
    </div>

    <ul
      class="status-select__options"
      :class="{'hidden': !isOpened}"
    >
      <li class="status-select__item" @click="close">
        <span
          class="status-select__indicator"
          :class="computeCurrentStatusIndicatorClass"
        ></span>
        <div class="status-select__item__text">{{ duration }}</div>
        <icon class="status-select__arrow">
          <svg class="icon icon-arrow-down-md md">
            <use xlink:href="#icon-arrow-down-md"></use>
          </svg>
        </icon>
      </li>
      <li class="status-select__item"
          v-for="(status, key) of computeAvailableStatus"
          :key="key"
          @click="changeStatus(status.value)"
      >
        <span
          class="status-select__indicator"
          :class="`${status.class}`"
        ></span>
        <div class="status-select__item__text">{{ status.text }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import UserStatus from '../../store/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'status-select',

  data: () => ({
    AgentStatus,
    UserStatus,
    isOpened: false,
  }),

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

    agentStatusList() {
      return [
        {
          text: this.$t('agentStatus.status.active'),
          class: 'active',
          value: AgentStatus.Offline,
        },
        {
          text: this.$t('agentStatus.status.break'),
          class: 'pause',
          value: AgentStatus.Pause,
        },
      ];
    },

    userStatusList() {
      return [
        {
          text: this.$t('agentStatus.status.active'),
          class: 'active',
          value: UserStatus.ACTIVE,
        },
        {
          text: this.$t('agentStatus.status.dnd'),
          class: 'dnd',
          value: UserStatus.DND,
        },
      ];
    },

    computeAvailableStatus() {
      if (this.isAgent) {
        return this.agentStatusList.filter((status) => status.value !== this.agent.status);
      }
      return this.userStatusList.filter((status) => status.value !== this.user.status);
    },

    // FIXME to redo with lastStateChange getter from sdk, when it's ready
    duration() {
      if (this.isAgent) {
        if (this.now) {
          return convertDuration(this.agent.stateDuration);
        }
      }
      let time = (this.now - this.user.lastStateChange || Date.now());
      time = time < 0 ? 0 : time;
      return convertDuration(time / 1000);
    },

    computeCurrentStatusIndicatorClass() {
      if (this.isAgent) {
        const { status } = this.agent;
        return `${status}`;
      }
      const { status } = this.user;
      switch (status) {
        case UserStatus.ACTIVE:
          return 'active';
        case UserStatus.DND:
          return 'dnd';
        default:
          return '';
      }
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
            return;
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
            return;
        }
      }
      this.close();
    },

    close() {
      this.isOpened = false;
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
$active-color: $true-color;
$stop-color: $false-color;
$default-indicator: $page-bg-color;
$option-bg__hover: $page-bg-color;

.status-select {
  position: relative;
  z-index: 100;

  &__item {
    display: flex;
    align-items: center;
    width: (130px);
    word-break: break-all;
    padding: (5px) (5px) (5px) (10px);
    background: #fff;
    transition: $transition;
    cursor: pointer;

    &__selected {
      border-radius: $border-radius;
    }

    &__text {
      @extend .typo-heading-sm;
    }
  }

  &__indicator {
    display: inline-block;
    width: (14px);
    height: (14px);
    margin-right: (9px);
    background: $default-indicator;
    border-radius: 50%;

    &.online, // AGENT
    &.active // USER
    {
      background: $active-color;
    }

    &.pause, // AGENT
    &.dnd // USER
    {
      background: $break-color;
    }

    &.stop // USER
    {
      background: $stop-color;
    }
  }

  &__arrow {
    margin-left: auto;

    .icon {
      fill: #000;
      stroke: #000;
    }
  }

  .status-select__options {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  &.opened {
    .status-select__options {
      background: #fff;
      box-shadow: $box-shadow;
      border-radius: $border-radius;

      .status-select__item {
        &:first-child, &:last-child {
          border-radius: $border-radius;
        }

        &:hover {
          background: $option-bg__hover;
        }
      }
    }
  }
}
</style>
