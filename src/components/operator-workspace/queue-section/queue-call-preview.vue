<template>
  <article class="queue-preview">
    <header class="preview-header">
      <span class="preview-header__name">{{computeDisplayName}}</span>
      <span class="preview-header__time">{{computeCreatedTime}}</span>
    </header>
    <span class="call-preview__number">{{computeDisplayNumber}}</span>
    <div class="preview-actions">
      <rounded-action
        class="preview-action preview-action__answer"
        @click.native="$emit('accept')"
      >
        Answer
      </rounded-action>
      <rounded-action
        class="preview-action preview-action__reject"
        @click.native="$emit('reject')"
      >
        Reject
      </rounded-action>
    </div>
  </article>
</template>

<script>
  import callInfo from '../../../mixins/callInfoMixin';
  import RoundedAction from '../../utils/rounded-action.vue';

  export default {
    name: 'queue-call-preview',
    mixins: [callInfo],
    components: {
      RoundedAction,
    },

    props: {
      itemInstance: {
        type: Object,
        required: true,
      },
    },

    data: () => ({
      now: Date.now(),
    }),

    watch: {
      itemInstance: (value) => {
        console.error('item changed', value);
      },
    },

    mounted() {
      console.error('ITEM', this.itemInstance);
      setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },

  };
</script>

<style lang="scss">
  .queue-preview {
    padding: 20px 30px;
    border-bottom: 1px solid blue;
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
