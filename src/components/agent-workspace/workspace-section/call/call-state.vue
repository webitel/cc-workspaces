<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <img
        v-show="isCallActive"
        alt=""
        src="../../../../assets/agent-workspace/workspace-section/call-sonars/active-sonar.svg">
      <img
        v-show="isCallRinging"
        alt=""
        src="../../../../assets/agent-workspace/workspace-section/call-sonars/ringing-sonar.svg">
      <img
        v-show="isCallOnHold"
        alt=""
        src="../../../../assets/agent-workspace/workspace-section/call-sonars/hold-sonar.svg">
    </div>
    <div
      v-if="!isCallActive"
      class="numpad-state__primary-text"
    >{{ callState }}
    </div>
    <div
      v-else
      class="numpad-state__primary-text"
    >
      <span
        v-for="(digit, key) of startTime.split('')"
        :key="key"
        class="numpad-state__primary-text__time-digit"
      >{{ digit }}</span>
    </div>
    <div class="numpad-state__secondary-text">{{ computeDTMFDigits }}</div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { CallActions } from 'webitel-sdk';
import callTimer from '../../../../mixins/callTimerMixin';

export default {
  name: 'call-state',
  mixins: [callTimer],

  data: () => ({
    CallActions,
  }),

  computed: {
    ...mapState('call', {
      call: (state) => state.callOnWorkspace,
    }),

    ...mapGetters('call', {
      computeDTMFDigits: 'GET_CURRENT_CALL_DIGITS',
    }),

    callState() {
      switch (this.call.state) {
        case CallActions.Ringing:
          return this.$t('workspaceSec.callState.ringing');
        case CallActions.Hold:
          return this.$t('workspaceSec.callState.hold');
        case CallActions.Hangup:
          return this.$t('workspaceSec.callState.hangup');
        case CallActions.Active:
          return this.startTime;
        default:
          return this.call.state || '';
      }
    },

    isCallActive() {
      return this.call.state === CallActions.Active;
    },
    isCallRinging() {
      return this.call.state === CallActions.Ringing;
    },
    isCallOnHold() {
      return this.call.state === CallActions.Hold;
    },
  },
};
</script>

<style lang="scss" scoped>
.typo-call-state {
  font-family: 'Montserrat Semi', monospace;
  font-size: 40px;
  line-height: 40px;
}

.numpad-state {
  display: flex;
  align-items: center;
  flex-direction: column;

  &__animation {
    width: 52px;
    height: 52px;
    margin-bottom: 10px;
    overflow: hidden;
  }

  &__primary-text {
    @extend .typo-call-state;
    text-align: center;
    height: 40px; // line height + 2 margins
    margin-top: 25px; // FIXME ANIMATION
    margin-bottom: 25px;

    .numpad-state__primary-text__time-digit {
      display: inline-block;
      text-align: center;
      width: 26px;

      /*semicolons*/
      &:nth-child(3), &:nth-child(6) {
        width: 12px;
      }
    }
  }

  &__secondary-text {
    @extend .typo-heading-sm;
    min-height: 16px;
  }
}
</style>
