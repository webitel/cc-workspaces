<template>
  <article class="queue-preview" :class="{'hold': isHold}">
    <aside
      class="queue-preview__status"
      :class="computePreviewStatusClass"
    >
      <icon v-if="isHold">
        <svg class="icon icon-hold-sm sm">
          <use xlink:href="#icon-hold-sm"></use>
        </svg>
      </icon>
      <icon v-else>
        <svg class="icon icon-call-sm sm">
          <use xlink:href="#icon-call-sm"></use>
        </svg>
      </icon>
    </aside>

    <header class="preview-header">
      <span class="preview-header__name">{{computeDisplayName}}</span>
      <!--v-for for timer not to resize on digit width change-->
      <div class="preview-header__time"
           :class="{'preview-header__time__bold': !isRinging}"
      >
          <span
            class="preview-header__time-digit"
            v-for="(digit, key) of computeCreatedTime.split('')"
            :key="key"
          >{{digit}}</span>
      </div>

    </header>
    <span
      class="call-preview__number">{{computeDisplayNumber}}</span>
    <div
      v-if="isRinging"
      class="preview-actions"
    >
      <btn
        class="uppercase call"
        @click.native.stop="answer(index)"
      >
        Answer
      </btn>
      <btn
        class="uppercase end"
        @click.native.stop="hangup(index)"
      >
        Reject
      </btn>
    </div>
  </article>
</template>

<script>
  import { mapActions } from 'vuex';
  import { CallActions, CallDirection } from 'webitel-sdk';
  import Btn from '../../utils/btn.vue';
  import callInfo from '../../../mixins/callInfoMixin';

  export default {
    name: 'queue-call-preview',
    mixins: [callInfo],
    components: {
      Btn,
    },

    props: {
      // index is for action calls
      index: {
        type: Number,
        required: true,
      },

      // item is for UI computing
      itemInstance: {
        type: Object,
        required: true,
      },
    },

    computed: {
      isHold() {
        return this.itemInstance.isHold;
      },

      isRinging() {
        return this.itemInstance.state === CallActions.Ringing
          && this.itemInstance.direction === CallDirection.Inbound;
      },

      computePreviewStatusClass() {
        return this.itemInstance.isHold ? 'hold' : 'call';
      },
    },

    methods: {
      ...mapActions('workspace', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .queue-preview {
    box-sizing: border-box;
    position: relative;
    padding: calcVH(20px) calcVH(30px);
    border: calcVH(2px) solid transparent;
    border-bottom-color: $page-bg-color;
    border-radius: $border-radius;

    &.hold {
      border: calcVH(2px) solid $hold-color;
    }
  }

  .preview-header {
    display: flex;
    justify-content: space-between;

    &__name {
      @extend .typo-heading-sm;
    }

    &__time {
      .preview-header__time-digit {
        @extend .typo-body-md;
        text-align: center;
        display: inline-block;
        width: calcVH(9.5px);

        /*semicolons*/
        &:nth-child(3), &:nth-child(6) {
          width: calcVH(5px);
        }
      }

      &__bold .preview-header__time-digit {
        font-family: 'Montserrat Semi', monospace;
      }
    }
  }

  // .message-preview__text, FOR CHATS
  .call-preview__number {
    @extend .typo-body-md;
  }

  .preview-actions {
    display: flex;
    justify-content: space-between;
    margin-top: calcVH(20px);

    .cc-btn {
      flex-grow: 1;

      &:first-child {
        margin-right: calcVH(20px);
      }
    }
  }

  .queue-preview__status {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calcVH(10px);
    left: calcVH(10px);
    width: calcVH(17px);
    height: calcVH(17px);
    border-radius: 50%;

    .icon {
      fill: #fff;
      stroke: #fff;
    }

    &.call {
      background: $call-btn-color;
    }

    &.hold {
      background: $hold-btn-color;
    }
  }
</style>
