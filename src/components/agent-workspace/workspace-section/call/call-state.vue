<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <iframe
        v-if="animationUrl"
        :src="animationUrl"
      ></iframe>
    </div>
    <div
      v-if="!isCallActive"
      class="numpad-state__primary-text"
    >{{callState}}
    </div>
    <div
      v-else
      class="numpad-state__primary-text"
    >
      <span
        class="numpad-state__primary-text__time-digit"
        v-for="(digit, key) of computeCreatedTime.split('')"
        :key="key"
      >{{digit}}</span>
    </div>
    <div class="numpad-state__secondary-text">{{computeDTMFDigits}}</div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
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
            return 'Ringing..';
          case CallActions.Hold:
            return 'Hold';
          case CallActions.Hangup:
            return 'Hangup';
          case CallActions.Active:
            return this.computeCreatedTime;
          default:
            return this.call.state || '';
        }
      },

      animationUrl() {
        const baseUrl = process.env.BASE_URL; // to resolve iframe equalizer path after build
        let animation = '';
        switch (this.call.state) {
          case CallActions.Ringing:
            animation = 'ringing';
            break;
          case CallActions.Hold:
            animation = 'hold';
            break;
          case CallActions.Active:
            animation = 'active';
            break;
          default:
            break;
        }
        return animation
          ? `${baseUrl}animations/call-sonars/${animation}/${animation}.html`
          : false;
      },

      isCallActive() {
        return this.call.state === CallActions.Active;
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
