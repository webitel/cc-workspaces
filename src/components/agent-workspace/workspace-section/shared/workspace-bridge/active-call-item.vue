<template>
  <article class="ws-worksection__item ws-contact-item">
    <img
      class="ws-worksection__item__pic"
      src="../../../../../assets/agent-workspace/default-avatar.svg"
      alt="user photo">
    <div class="ws-worksection__item__text">
      <div class="flex-wrap">
        <div class="ws-contact-item__name">{{displayName}}</div>
        <div class="ws-contact-item__number">{{displayNumber}}</div>
      </div>
    </div>
    <div class="ws-worksection__item__status">
      <div class="ws-worksection__item__time ws-worksection__item__time__bold"
      >
          <span
            class="preview-header__time-digit"
            v-for="(digit, key) of computeCreatedTime.split('')"
            :key="key"
          >{{digit}}</span>
      </div>
    </div>
  </article>
</template>

<script>
  import { CallActions, CallDirection } from 'webitel-sdk';
  import callTimer from '../../../../../mixins/callTimerMixin';
  import displayInfo from '../../../../../mixins/displayInfoMixin';

  export default {
    name: 'active-call-item',
    mixins: [callTimer, displayInfo],

    props: {
      // item is for UI computing
      call: {
        type: Object,
        required: true,
        default: () => ({
          answeredAt: Date.now(),
          displayName: 'Administrator Lisa',
          displayNumber: '3434',
        }),
      },
    },

    computed: {
      isHold() {
        return this.call.isHold;
      },

      isRinging() {
        return this.call.state === CallActions.Ringing
          && this.call.direction === CallDirection.Inbound;
      },
    },
  };
</script>

<style lang="scss" scoped>

  .flex-wrap {
    height: 100%;
    flex-direction: column;
  }

  .ws-worksection__item__status {
    align-self: end;
    flex-basis: auto;
    width: auto;
    height: auto;

    .ws-worksection__item__time {
      .preview-header__time-digit {
        @extend .typo-body-md;
        text-align: center;
        display: inline-block;
        width: (9.5px);

        /*semicolons*/
        &:nth-child(3), &:nth-child(6) {
          width: (5px);
        }
      }

      &__bold .preview-header__time-digit {
        font-family: 'Montserrat Semi', monospace;
      }
    }
  }
</style>
