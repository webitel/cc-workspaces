<template>
  <div class="video-call-state">
    <div class="video-call-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      />
    </div>

    <div
      v-if="!isCallActive"
      class="video-call-state__primary-text typo-heading-1"
    >
      {{ callState }}
    </div>

    <div
      v-else
      class="video-call-state__primary-text typo-heading-1"
    >
      <span
        v-for="(digit, key) of displayTime.split('')"
        :key="key"
        class="video-call-state__primary-text__time-digit typo-body-1"
      >
        {{ digit }}
      </span>
    </div>

    <div
      v-if="dtmf && dtmf.length"
      class="video-call-state__secondary-text typo-subtitle-1"
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

const { dtmf, callState, isCallActive, displayTime, sonarIcon } =
	useCallState();
</script>

<style
  scoped
  lang="scss"
>
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

    &__time-digit {
      display: inline-block;
      width: 9px;
      text-align: center;

      // semicolons
      &:nth-child(3),
      &:nth-child(6) {
        width: 6px;
      }

      // semicolons
      &:nth-child(3),
      &:nth-child(6) {
        width: 6px;
      }
    }
  }

  &__secondary-text {
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
