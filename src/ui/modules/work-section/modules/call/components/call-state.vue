<template>
  <div
    class="call-state"
    :class="{ 'call-state--centered': centered }"
  >
    <div class="call-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      />
    </div>
    <div
      v-if="showTimer"
      class="call-state__primary-text"
    >
      <span class="call-state__primary-text__state">
        <span class="call-state__primary-text__state">
          {{ callState }}{{ showTimer ? ': ' : '' }}
        </span>
        <span
          v-for="(digit, key) of displayTime.split('')"
          :key="key"
          class="call-state__primary-text__time-digit"
        >
          {{ digit }}
        </span>
        >
        {{ digit }}
      </span>
    </div>
    <div
      v-if="dtmf"
      class="call-state__secondary-text typo-subtitle-1"
    >
      {{ dtmf.join('') }}
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { useCallState } from '../../../../../composables/useCallState';

defineOptions({
	name: 'CallState',
});

withDefaults(defineProps<{
  centered?: boolean;
}>(), {
  centered: false,
});

const { dtmf, callState, showTimer, displayTime, sonarIcon } = useCallState();
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.call-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;

  &--centered {
    justify-content: center;
    height: 100%;
  }

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

      /*semicolons*/
      &:nth-child(4),
      &:nth-child(7) {

        &:nth-child(4),
        &:nth-child(7) {
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
}
</style>
