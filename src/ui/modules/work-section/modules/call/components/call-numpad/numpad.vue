<template>
  <div class="numpad">
    <wt-input-text
      v-show="isNewCall"
      ref="number-input"
      v-model:model-value="call.newNumber"
      @enter="makeCall"
    />
    <call-state />
    <div class="numpad-wrapper">
      <numpad-numbers
        ref="numpad-numbers"
        :size="size"
        :class="{'numpad-numbers--opened': isNumpadOpened}"
        @input="handleNumpadInput"
      ></numpad-numbers>
    </div>
    <numpad-expansion-btn
      class="numpad-btn"
      :is-opened="isNumpadOpened"
      @toggle="isNumpadOpened = !isNumpadOpened"
    ></numpad-expansion-btn>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, useTemplateRef } from 'vue';
import { useStore } from 'vuex';
import { ComponentSize } from '@webitel/ui-sdk/enums';

import CallState from '../call-state.vue';
import NumpadExpansionBtn from './numpad-expansion-btn.vue';
import NumpadNumbers from './numpad-numbers.vue';

const props = defineProps({
  size: {
    type: ComponentSize,
    default: ComponentSize.MD,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();

const isNumpadOpened = ref(false);
const numberInput = useTemplateRef('number-input');
const numpadNumbers = ref(null);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const input = (value) => store.dispatch('features/call/ADD_DIGIT', value);
const makeCall = () => store.dispatch('features/call/CALL');

const setNumberFocus = () => {
  const input = numberInput.value?.$el?.querySelector('input');
  if (input) input.focus();
};

const handleNumpadInput = (value) => {
  input(value);
  setNumberFocus();
};

onMounted(() => {
  setNumberFocus();
});

watch(() => props.isActive, (active) => {
  if (active) setNumberFocus();
})
</script>

<style lang="scss" scoped>
.numpad {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 100%; // make child height 100& of container
  gap: 25px;
  height: 100%;

  .wt-input-text ::v-deep .wt-input-text__input {
    text-align: center;
  }

  .numpad-btn {
    display: none;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    @media screen and (max-height: 719px) {
      display: block;
    }
  }

  .numpad-state {
    @media screen and (max-height: 719px) {
      margin: 0 auto;
    }
  }

  .numpad-numbers {
    align-self: flex-end;

    @media screen and (max-height: 719px) {
      position: absolute;
      bottom: 53px;
      left: 50%;
      padding: var(--spacing-xs);
      background: var(--content-wrapper-color);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      opacity: 0;
      pointer-events: none;
      z-index: 1;
      transform: translateX(-50%);

      &--opened {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
}
</style>
