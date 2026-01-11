<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      />
    </div>
    <div
      v-if="showTimer"
      class="numpad-state__primary-text"
    >
      <span class="numpad-state__primary-text__state">
        {{ callState }}{{ showTimer ? ': ' : '' }}
      </span>
      <span
        v-for="(digit, key) of displayTime.split('')"
        :key="key"
        class="numpad-state__primary-text__time-digit"
      >
        {{ digit }}
      </span>
    </div>
    <div
      v-if="dtmf"
      class="numpad-state__secondary-text"
    >
      {{ dtmf.join('') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCallState } from '../../../../../composables/useCallState';

defineOptions({
  name: 'CallState',
});

const { dtmf, callState, showTimer, displayTime, sonarIcon } = useCallState();
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.numpad-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: center;
  max-width: 100%;

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

      /*semicolons*/
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
