<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <img
        alt=""
        :src="sonarIcon"
      >
    </div>
    <div
      v-if="showTimer"
      class="numpad-state__primary-text"
    >
      <span
        class="numpad-state__primary-text__state">
        {{ callState }}{{ showTimer ? ': ' : '' }}
      </span>
      <span
        v-for="(digit, key) of displayTime.split('')"
        :key="key"
        class="numpad-state__primary-text__time-digit"
      >{{ digit }}</span>
    </div>
    <div
      v-if="dtmf"
      class="numpad-state__secondary-text"
    >{{ dtmf.join('') }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { CallActions, CallDirection } from 'webitel-sdk';

import blackSonar from '../../../../../../app/assets/call-sonars/black-sonar.svg';
import greenSonar from '../../../../../../app/assets/call-sonars/green-sonar.svg';
import redSonar from '../../../../../../app/assets/call-sonars/red-sonar.svg';
import yellowSonar from '../../../../../../app/assets/call-sonars/yellow-sonar.svg';
import { useCallTimer } from '../../../../../composables/useCallTimer'

defineOptions({
  name: 'CallState'
})

const store = useStore();
const { t } = useI18n();

const task = computed(
  () => store.getters['features/call/CALL_ON_WORKSPACE'],
);
const dtmf = computed(
  () => store.getters['features/call/GET_CURRENT_CALL_DIGITS'],
);

const { hangupTime, holdTime, startTime } = useCallTimer(task);

const callState = computed(
  () => {
    switch (task.value.state) {
      case CallActions.Ringing:
        return t('workspaceSec.callState.ringing');
      case CallActions.Hold:
        return t('workspaceSec.callState.onHold');
      case CallActions.Active:
        return t('workspaceSec.callState.inCall');
      case CallActions.Hangup:
        return t('workspaceSec.callState.hangup');
      default:
        return task.value.state || '';
    }
  }
)

const isCallActive = computed(
  () => task.value.state === CallActions.Active
)

const showTimer = computed(
  () => isCallActive.value || task.value.isHold || task.value.state === CallActions.Hangup
)

const displayTime = computed(
  () => {
    if (task.value.state === CallActions.Hangup) return hangupTime.value;
    if (task.value.isHold) return holdTime.value;
    return startTime.value;
  }
)

const sonarIcon = computed(
  () => {
    if (task.value.state === CallActions.Hangup) return redSonar;
    if (task.value.isHold) return yellowSonar;
    if (task.value.state === CallActions.Ringing) {
      if (task.value.direction === CallDirection.Inbound) return redSonar;
      return blackSonar;
    }
    if (isCallActive.value) return greenSonar;
    return '';
  }
)
</script>

<style lang="scss" scoped>
.numpad-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 100%;

  &__animation {
    width: 52px;
    height: 52px;
    margin-bottom: var(--spacing-xs);
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
      text-align: center;
      width: 9px;

      /*semicolons*/
      &:nth-child(4), &:nth-child(7) {
        width: 6px;
      }
    }
  }

  &__secondary-text {
    @extend %typo-subtitle-1;
    text-align: center;
    min-height: 40px;
    width: 100%;
    padding: var(--spacing-xs);
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius);
    word-wrap: break-word;
  }
}
</style>
