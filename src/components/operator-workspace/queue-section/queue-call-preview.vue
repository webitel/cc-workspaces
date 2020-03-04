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
      <span
        class="preview-header__time"
        :class="{'preview-header__time__bold': !isRinging}"
      >{{computeCreatedTime}}</span>
    </header>
    <span
      class="call-preview__number">{{computeDisplayNumber}}</span>
    <div
      v-if="isRinging"
      class="preview-actions"
    >
      <btn
        class="uppercase call"
        @click.native="answer(index)"
      >
        Answer
      </btn>
      <btn
        class="uppercase end"
        @click.native="hangup(index)"
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
      ...mapActions('operator', {
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
    padding: calcRem(20px) calcRem(30px);
    border: 2px solid transparent;
    border-bottom-color: $page-bg-color;
    border-radius: $border-radius;

    &.hold {
      border: 2px solid $hold-color;
    }
  }

  .preview-header {
    display: flex;
    justify-content: space-between;

    &__name {
      @extend .typo-heading-sm;
    }

    &__time {
      @extend .typo-body-md;

      &__bold {
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
    margin-top: calcRem(20px);

    .cc-btn {
      flex-grow: 1;

      &:first-child {
        margin-right: calcRem(20px);
      }
    }
  }

  .queue-preview__status {
    position: absolute;
    top: calcRem(10px);
    left: calcRem(10px);
    width: calcRem(17px);
    height: calcRem(17px);
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
