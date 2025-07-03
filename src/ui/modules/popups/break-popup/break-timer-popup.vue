<template>
  <wt-popup
    v-if="isBreakPopup"
    class="break-timer-popup"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ $t('agentStatus.breakTimer.heading', { mode: $t(`agentStatus.breakTimer.mode.${agentStatus}`) }) }}
    </template>
    <template #main>
      <div class="break-timer-popup__main-wrapper">
        <div class="break-timer-popup__icon-wrapper">
          <wt-icon
            :icon="agentStatus === AgentStatus.Pause ? 'pause' : 'breakout'"
            icon-prefix="ws"
            size="3xl"
          ></wt-icon>
        </div>
        <div class="break-timer-popup__timer-wrap">
          <div class="break-timer-popup-timer">
            <span
              v-for="(digit, key) of duration.split('')"
              :key="key"
              class="break-timer-popup-timer__digit"
            >
              {{ digit }}
            </span>
          </div>
          <div class="break-timer-popup-pause-cause">
            {{ breakInfo }}
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <wt-button
        color="success"
        wide
        @click="setAgentWaiting"
      >{{ $t('agentStatus.breakTimer.continueWork') }}
      </wt-button>
      <wt-button
        color="error"
        wide
        @click="agentLogout"
      >{{ $t('reusable.logout') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { mapActions,mapState } from 'vuex';
import { AgentStatus } from 'webitel-sdk';

export default {
  name: 'BreakTimerPopup',
  data: () => ({
    AgentStatus,
    duration: '00:00:00',
    isBreakPopupValue: false,
  }),
  watch: {
    now: {
      handler() {
        this.duration = convertDuration(this.agent?.stateDuration);
      },
      immediate: true,
    },
    agentStatus: {
      handler() {
        if (this.agentStatus === AgentStatus.Pause
          || this.agentStatus === AgentStatus.BreakOut) this.isBreakPopupValue = true;
      },
      immediate: true,
    },
    breakInfo: {
      handler() {
        if (this.agentStatus === AgentStatus.Pause
          || this.agentStatus === AgentStatus.BreakOut) this.isBreakPopupValue = true;
      },
      immediate: true,
    },
  },

  computed: {
    ...mapState('ui/now', {
      now: (state) => state.now,
    }),
    ...mapState('features/status', {
      agent: (state) => state.agent,
    }),
    isBreakPopup() {
      return this.isBreakPopupValue
        && (this.agentStatus === AgentStatus.Pause || this.agentStatus === AgentStatus.BreakOut);
    },
    agentStatus() {
      return this.agent.status;
    },
    breakInfo() {
      return this.agentStatus === AgentStatus.Pause
        ? this.agent.statusPayload
        : this.$t(`agentStatus.breakTimer.${AgentStatus.BreakOut}`);
    },
  },

  methods: {
    ...mapActions('features/status', {
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
%typo-timer-digits {
  font-family: 'Montserrat', monospace;
  font-size: 64px;
  line-height: 78px;
  font-weight: 700;
}

.break-timer-popup__main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--warning-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
}

.break-timer-popup__icon-wrapper {
  padding: var(--spacing-sm);
  line-height: 0;
  background: var(--content-wrapper-color);
  border-radius: var(--border-radius);
}

.break-timer-popup-timer {
  width: fit-content;
  margin: auto;
}

.break-timer-popup-timer__digit {
  @extend %typo-timer-digits;
  text-align: center;
  display: inline-block;
  width: 40px;
  color: var(--primary-on-color);

  /*semicolons*/
  &:nth-child(3), &:nth-child(6) {
    width: 24px;
  }
}

.break-timer-popup-pause-cause {
  @extend %typo-subtitle-2;
  text-align: center;
  color: var(--primary-on-color);
}
</style>
