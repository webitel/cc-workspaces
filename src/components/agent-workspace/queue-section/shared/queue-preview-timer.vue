<template>
  <div class="call-preview-timer" :class="{ 'call-preview-timer--bold': bold }">
    <!--v-for for timer not to resize on digit width change-->
    <span
      class="call-preview-timer__digit"
      v-for="(digit, key) of startTime.split('')"
      :key="key"
    >{{ digit }}</span>
  </div>
</template>

<script>
import callTimer from '../../../../mixins/callTimerMixin';

export default {
  name: 'queue-preview-timer',
  mixins: [callTimer],
  props: {
    task: {
      type: Object,
      required: true,
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.call-preview-timer {
  display: flex;
  align-items: flex-start;

  &__digit {
    @extend %typo-body-md;
    text-align: center;
    width: (9.5px);

    /*semicolons*/
    &:nth-child(3), &:nth-child(6) {
      width: (5px);
    }
  }

  &--bold .call-preview-timer__digit {
    font-family: 'Montserrat Semi', monospace;
  }
}
</style>
