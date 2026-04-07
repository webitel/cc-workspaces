<template>
  <wt-input-text
    :model-value="dtmfValue"
    readonly
  />
</template>

<script setup>
import { computed } from 'vue';
import { useCallState } from '../../../../../../composables/useCallState.ts';

const { dtmf } = useCallState();
const dtmfValue = computed(() =>
	dtmf.value?.length > 0 ? dtmf.value?.join('') : '',
);
</script>
