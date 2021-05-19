<template>
  <wt-popup
    class="break-timer-popup"
    v-show="isBreakPopup"
    @close="close"
  >
    <template slot="title">
      <div class="break-timer-popup__title-wrapper">
        <span class="popup-indicator__break"></span>
        {{ $t('agentStatus.breakTimer.heading') }}
      </div>
    </template>
    <template slot="main">
      <div class="break-timer-wrap__timer-wrap">
        <div class="break-timer-wrap__timer">
            <span
              class="break-timer-wrap__timer__digit"
              v-for="(digit, key) of duration.split('')"
              :key="key"
            >
              {{ digit }}
            </span>
        </div>
      </div>
    </template>
    <template slot="actions">
      <wt-button
        color="success"
        @click="setAgentWaiting"
      >{{ $t('agentStatus.breakTimer.continueWork') }}
      </wt-button>
      <wt-button
        color="danger"
        @click="agentLogout"
      >{{ $t('reusable.logout') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { AgentStatus } from 'webitel-sdk';

export default {
  name: 'break-timer-popup',
  data: () => ({
    duration: '00:00:00',
    isBreakPopupValue: false,
  }),
  watch: {
    now: {
      handler() {
        this.duration = convertDuration(this.agent.stateDuration);
      },
      immediate: true,
    },
    agentStatus: {
      handler() {
        if (this.agentStatus === AgentStatus.Pause) this.isBreakPopupValue = true;
      },
      immediate: true,
    },
  },

  computed: {
    ...mapState('now', {
      now: (state) => state.now,
    }),
    ...mapState('status', {
      agent: (state) => state.agent,
      agentStatus: (state) => state.agent.status,
    }),
    isBreakPopup() {
      return this.isBreakPopupValue && this.agentStatus === AgentStatus.Pause;
    },
  },

  methods: {
    ...mapActions('status', {
      setAgentWaiting: 'SET_AGENT_WAITING_STATUS',
      agentLogout: 'AGENT_LOGOUT',
    }),
    close() {
      this.isBreakPopupValue = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.typo-timer-digits {
  font-family: 'Montserrat Semi', monospace;
  font-size: 82px;
  line-height: 82px;

  @media screen and (max-width: 1336px) {
    font-size: 60px;
    line-height: 60px;
  }
}

.break-timer-popup__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  .popup-indicator__break {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 11px;
    border-radius: 50%;
    background: var(--main-accent-color);
  }
}

.break-timer-wrap__timer-wrap {
  padding: 27px 51px;
  background: var(--main-accent-color);
  border-radius: var(--border-radius);
}

.break-timer-wrap__timer {
  width: fit-content;
  width: -moz-fit-content;
  margin: auto;
}

.break-timer-wrap__timer__digit {
  @extend .typo-timer-digits;
  text-align: center;
  display: inline-block;
  width: 55px;
  color: var(--text-primary-color);

  /*semicolons*/
  &:nth-child(3), &:nth-child(6) {
    width: 28px;
  }

  @media screen and (max-width: 1336px) {
    width: 40px;

    /*semicolons*/
    &:nth-child(3), &:nth-child(6) {
      width: 20px;
    }
  }
}
</style>
