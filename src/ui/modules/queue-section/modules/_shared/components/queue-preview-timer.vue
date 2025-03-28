<template>
  <div class="queue-preview-timer">
    <!--v-for for timer not to resize on digit width change-->
    <span
      v-for="(digit, key) of startTime.split('')"
      :key="key"
      class="queue-preview-timer__digit"
    >{{ digit }}</span>
  </div>
</template>

<script>
import callTimer from '../../../../../mixins/callTimerMixin';

export default {
  name: 'QueuePreviewTimer',
  mixins: [callTimer],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.queue-preview-timer {
  display: inline-flex;
  align-items: flex-start;

  &__digit {
    @extend %typo-body-2;
    text-align: center;
    width: 7.5px;

    /*semicolons*/
    &:nth-child(3), &:nth-child(6) {
      width: var(--spacing-2xs);
    }
  }
}
</style>
