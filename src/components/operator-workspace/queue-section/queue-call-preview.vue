<template>
  <article class="queue-preview">
    <header class="preview-header">
      <span class="preview-header__name">Oleg Marchenko</span>
      <span class="preview-header__time">00:00</span>
    </header>
    <span class="call-preview__number">+38 (063) 915-15-12</span>
    <div class="preview-actions">
      <rounded-action class="preview-action preview-action__answer">Answer</rounded-action>
      <rounded-action class="preview-action preview-action__decline">Decline</rounded-action></div>
  </article>
</template>

<script>
  import RoundedAction from '../../utils/rounded-action.vue';

  export default {
    name: 'queue-call-preview',
    components: {
      RoundedAction,
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

      &__decline {
        background: $false-color;
      }
    }
  }
</style>
