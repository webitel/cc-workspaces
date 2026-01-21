<template>
  <div class="video-call-state">
    <div class="video-call-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      >
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
        v-for="(digit, key) in startTime.split('')"
        :key="key"
        class="video-call-state__primary-text__time-digit typo-body-1"
      >
        {{ digit }}
      </span>
    </div>

    <div
      v-if="getDtmfDigits && getDtmfDigits.length"
      class="video-call-state__secondary-text typo-subtitle-1"
    >
      {{ getDtmfDigits.join('') }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { CallActions } from 'webitel-sdk';

import { useCallTimer } from '../../../../../../../composables/useCallTimer';
import yellowSonar from '../../../../../../../../app/assets/call-sonars/yellow-sonar.svg';
import greenSonar from '../../../../../../../../app/assets/call-sonars/green-sonar.svg';

defineOptions({
  name: 'VideoCallState',
});

const store = useStore();
const { t } = useI18n();

const task = computed(
  () => store.getters['features/call/CALL_ON_WORKSPACE'],
);
const getDtmfDigits = computed(
  () => store.getters['features/call/GET_CURRENT_CALL_DIGITS'],
);

const { startTime } = useCallTimer(task);

const isCallActive = computed(
  () => task.value?.state === CallActions.Active,
);

const callState = computed(() => {
  const currentTask = task.value;
  if (!currentTask) return '';

  switch (currentTask.state) {
    case CallActions.Ringing:
      return t('workspaceSec.callState.ringing');
    case CallActions.Hold:
      return t('workspaceSec.callState.onHold');
    case CallActions.Hangup:
      return t('workspaceSec.callState.hangup');
    case CallActions.Active:
      return startTime.value;
    default:
      return currentTask.state || '';
  }
});

const sonarIcon = computed(() => {
  const currentTask = task.value;
  if (!currentTask) return '';

  if (currentTask.isHold) return yellowSonar;
  if (currentTask.state === CallActions.Active) return greenSonar;
  return '';
});
</script>

<style
  scoped
  lang="scss"
>
@use '@webitel/ui-sdk/src/css/main' as *;

.video-call-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;
  height: 100%;

  &__animation {
    width: 52px;
    height: 52px;
    margin-bottom: var(--spacing-xs);
    overflow: hidden;
  }

  &__primary-text {
    text-align: center;

    &__time-digit {
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
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius);
    word-wrap: break-word;
  }
}
</style>
