<template>
  <div class="numpad">
    <call-state />
    <div class="numpad-numbers-wrapper">
      <wt-input-text
        v-if="isNewCall"
        ref="number-input"
        v-model:model-value="call.newNumber"
        @keyup.enter.native="makeCall"
      />
      <dtmf-readonly-input
        v-else-if="isCallActive"
      />
      <numpad-numbers
        ref="numpad-numbers"
        :size="size"
        @input="handleNumpadInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, onActivated, onMounted, ref, useTemplateRef } from 'vue';
import { useStore } from 'vuex';
import { useCallState } from '../../../../../../composables/useCallState.ts';

import CallState from '../call-state.vue';
import DtmfReadonlyInput from './dtmf-readonly-input.vue';
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
const { isCallActive } = useCallState();

const numberInput = useTemplateRef('number-input');
const numpadNumbers = ref(null);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const inputDigit = (value) => store.dispatch('features/call/ADD_DIGIT', value);
const makeCall = () => store.dispatch('features/call/CALL');

const setInputFocus = () => {
	if (numberInput.value) numberInput.value.focus();
};

const handleNumpadInput = (value) => {
	inputDigit(value);
	setInputFocus();
};

onMounted(() => {
	setInputFocus();
});

onActivated(() => {
	setInputFocus();
});
</script>

<style lang="scss" scoped>
.numpad {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-basis: 100%; // make child height 100& of container
  gap: var(--spacing-xs);
  height: 100%;

  .wt-input-text ::v-deep .wt-input-text__input {
    text-align: center;
  }

  .numpad-numbers {
    align-self: flex-end;
  }
}

.numpad-numbers-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.numpad-numbers-wrapper .numpad-numbers {
  width: 100%;
}
</style>
