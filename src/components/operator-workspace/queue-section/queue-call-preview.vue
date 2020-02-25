<template>
  <article class="queue-preview" :class="{'hold': false}">
    <header class="preview-header">
      <span class="preview-header__name">{{computeDisplayName}}</span>
      <span class="preview-header__time">{{computeCreatedTime}}</span>
    </header>
    <span class="call-preview__number">{{computeDisplayNumber}}</span>
    <div class="preview-actions">
      <button
        class="preview-action preview-action__answer"
        @click.stop="answer(index)"
      >
        Answer
      </button>
      <button
        class="preview-action preview-action__reject"
        @click.stop="hangup(index)"
      >
        Reject
      </button>
    </div>
  </article>
</template>

<script>
  import { mapActions } from 'vuex';
  import callInfo from '../../../mixins/callInfoMixin';

  export default {
    name: 'queue-call-preview',
    mixins: [callInfo],

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

    data: () => ({
      now: Date.now(),
    }),

    mounted() {
      console.warn('ITEM FROM QUEUE PREVIEW', this.itemInstance);
      setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },

    computed: {},

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
    padding: 20px 30px;
    border-bottom: 1px solid blue;

    &.hold {
      background: yellow;
    }
  }

  .preview-header {
    display: flex;
    justify-content: space-between;

    &__name {
      @extend .typo-heading-sm;
    }
  }

  .call-preview__number, .message-preview__text {
    @extend .typo-body-md;
  }

  .preview-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .preview-action {
      @extend .typo-heading-sm;
      max-width: 130px;
      padding: 12px 31px;
      text-transform: uppercase;
      color: #fff;
      border-radius: $border-radius;
      border: none;

      &__answer {
        background: $true-color;
      }

      &__reject {
        background: $false-color;
      }
    }
  }
</style>
