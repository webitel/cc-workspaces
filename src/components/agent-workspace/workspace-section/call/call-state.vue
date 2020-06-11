<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <img
        v-show="false"
        style="width: 50px; height: 50px; border-radius: 50%;"
        src="https://static10.tgstat.ru/channels/_0/3b/3bc2c1c682ca9f9517380ce37ad01c75.jpg" alt="">
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
      baseUrl: process.env.BASE_URL, // to resolve iframe equalizer path after build
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

      isCallActive() {
        return this.call.state === CallActions.Active;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .typo-call-state {
    font-family: 'Montserrat Semi', monospace;
    font-size: (40px);
    line-height: (40px);
  }

  .numpad-state {
    display: flex;
    align-items: center;
    flex-direction: column;

    &__animation {
      width: (50px);
      height: (50px);
      margin-bottom: (10px);
    }

    &__primary-text {
      @extend .typo-call-state;
      text-align: center;
      margin-bottom: (25px);

      .numpad-state__primary-text__time-digit {
        display: inline-block;
        text-align: center;
        width: (26px);

        /*semicolons*/
        &:nth-child(3), &:nth-child(6) {
          width: (12px);
        }
      }
    }

    &__secondary-text {
      @extend .typo-heading-sm;
      min-height: (16px);
      margin-bottom: (55px);
    }
  }
</style>
