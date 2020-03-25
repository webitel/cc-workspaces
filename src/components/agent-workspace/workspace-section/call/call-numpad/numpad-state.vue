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
    >{{computeCallState}}
    </div>
    <div
      v-else
      class="numpad-state__primary-text"
    >
      <span
        class="numpad-state__primary-text__time-digit"
        v-for="(digit, key) of computeCreatedTime.split('')"
        :key="key"
      >{{digit || '0'}}</span>
    </div>
    <div class="numpad-state__secondary-text">{{computeDTMFDigits}}</div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import { CallActions } from 'webitel-sdk';
  import callInfo from '../../../../../mixins/callInfoMixin';

  export default {
    name: 'numpad-state',
    mixins: [callInfo],

    data: () => ({
      baseUrl: process.env.BASE_URL, // to resolve iframe equalizer path after build
      CallActions,
    }),

    computed: {
      computeCallState() {
        switch (this.itemInstance.state) {
          case CallActions.Ringing:
            return 'Ringing..';
          case CallActions.Hold:
            return 'Hold';
          case CallActions.Hangup:
            return 'Hangup';
          case CallActions.Active:
            return this.computeCreatedTime;
          default:
            return this.itemInstance.state || '';
        }
      },

      isCallActive() {
        return this.itemInstance.state === CallActions.Active;
      },

      ...mapState('workspace', {
        itemInstance: (state) => state.callOnWorkspace,
      }),

      ...mapGetters('workspace', {
        computeDTMFDigits: 'GET_CURRENT_CALL_DIGITS',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .typo-call-state {
    font-family: 'Montserrat Semi', monospace;
    @include fontSize(40px);
    @include lineHeight(40px);
  }

  .numpad-state {
    display: flex;
    align-items: center;
    flex-direction: column;

    &__animation {
      width: calcVH(50px);
      height: calcVH(50px);
      margin-bottom: calcVH(10px);
    }

    &__primary-text {
      @extend .typo-call-state;
      text-align: center;
      margin-bottom: calcVH(25px);

      .numpad-state__primary-text__time-digit {
        display: inline-block;
        text-align: center;
        width: calcVH(26px);

        /*semicolons*/
        &:nth-child(3), &:nth-child(6) {
          width: calcVH(12px);
        }
      }
    }

    &__secondary-text {
      @extend .typo-heading-sm;
      min-height: calcVH(16px);
      margin-bottom: calcVH(55px);
    }
  }
</style>
