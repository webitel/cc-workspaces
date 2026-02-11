<template>
  <wt-input-text
    v-bind="$attrs"
    :value="props.value"
    @update:modelValue="emit('input', $event)"
  ></wt-input-text>
</template>

<script setup lang="ts">
const emit = defineEmits<(e: 'input', string) => void>();

const props = defineProps<{
	modelValue?: string;
	value?: string;
}>();
</script>
