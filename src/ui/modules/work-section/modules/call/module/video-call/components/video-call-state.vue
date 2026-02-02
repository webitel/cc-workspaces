<template>
  <div class="video-call-state">
    <div class="video-call-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      />
    </div>

    <div
      v-if="showTimer"
      class="video-call-state__primary-text"
    >
      <span class="video-call-state__primary-text__state">
        {{ callState }}{{ showTimer ? ': ' : '' }}
      </span>
      <span
        v-for="(digit, key) of displayTime.split('')"
        :key="key"
        class="video-call-state__primary-text__time-digit"
      >
        {{ digit }}
      </span>
    </div>

    <div
      v-if="dtmf"
      class="video-call-state__secondary-text"
    >
      {{ dtmf.join('') }}
    </div>
  </div>
</template>

<script setup>
import { useCallState } from '../../../../../../../composables/useCallState';

defineOptions({
  name: 'VideoCallState',
});

const { dtmf, callState, showTimer, displayTime, sonarIcon } = useCallState();
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.video-call-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 100%;

  &__animation {
    margin-bottom: var(--spacing-xs);
    width: 52px;
    height: 52px;
    overflow: hidden;
  }

  &__primary-text {
    text-align: center;

    &__state {
      @extend %typo-body-1-bold;
    }

    &__time-digit {
      @extend %typo-body-1;
      display: inline-block;
      width: 9px;
      text-align: center;

      // semicolons
      &:nth-child(4),
      &:nth-child(7) {
        width: 6px;
      }
    }
  }

  &__secondary-text {
    @extend %typo-subtitle-1;
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius);
    padding: var(--spacing-xs);
    width: 100%;
    min-height: 40px;
    text-align: center;
    word-wrap: break-word;
  }
}
</style>
