<template>
  <div class="numpad-numbers">
    <wt-button
      v-for="(value) of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', '+']"
      :key="value"
      :size="ComponentSize.MD"
      class="numpad-numbers__number"
      color="secondary"
      outline
      rounded
      @click="inputNumber(value)"
    >{{ value }}
    </wt-button>
  </div>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { WtButton } from '@webitel/ui-sdk/src/components';

const emit = defineEmits([
	'input',
]);

function inputNumber(value) {
	emit('input', value);
}
</script>

<style scoped>
.numpad-numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: var(--spacing-2xs);
  width: auto;
}

.numpad-numbers__number:last-child {
  grid-column-start: 2;
}
</style>
