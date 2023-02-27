<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      >
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
    <div
      v-if="dtmf"
      class="numpad-state__secondary-text"
    >{{ dtmf.join('') }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { CallActions, CallDirection } from 'webitel-sdk';
import activeSonar from '../../../../../../app/assets/call-sonars/active-sonar.svg';
import holdSonar from '../../../../../../app/assets/call-sonars/hold-sonar.svg';
import inboundSonar from '../../../../../../app/assets/call-sonars/inbound-sonar.svg';
import ringingSonar from '../../../../../../app/assets/call-sonars/ringing-sonar.svg';
import callTimer from '../../../../../mixins/callTimerMixin';

export default {
  name: 'call-state',
  mixins: [callTimer],

  data: () => ({
    CallActions,
  }),

  computed: {
    ...mapGetters('features/call', {
      call: 'CALL_ON_WORKSPACE',
      dtmf: 'GET_CURRENT_CALL_DIGITS',
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
    sonarIcon() {
      if (this.call.isHold) return holdSonar;
      if (this.call.state === CallActions.Ringing) {
        if (this.call.direction === CallDirection.Inbound) return inboundSonar;
        return ringingSonar;
      }
      if (this.isCallActive) return activeSonar;
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.numpad-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 100%;

  &__animation {
    width: 52px;
    height: 52px;
    margin-bottom: var(--spacing-xs);
    overflow: hidden;
  }

  &__primary-text {
    @extend %typo-heading-1;
    text-align: center;

    .numpad-state__primary-text__time-digit {
      display: inline-block;
      text-align: center;
      width: 20px;

      /*semicolons*/
      &:nth-child(3), &:nth-child(6) {
        width: 12px;
      }
    }
  }

  &__secondary-text {
    @extend %typo-subtitle-1;
    text-align: center;
    min-height: 40px;
    width: 100%;
    padding: var(--spacing-xs);
    border: 1px solid var(--contrast-color);
    border-radius: var(--border-radius);
    word-wrap: break-word;
  }
}
</style>
