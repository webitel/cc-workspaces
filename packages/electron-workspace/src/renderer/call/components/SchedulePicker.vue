<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	modelValue: number | undefined;
}>();
const emit = defineEmits<{
	'update:modelValue': [
		value: number,
	];
}>();

const localValue = computed({
	get() {
		const ms = props.modelValue;
		if (!ms) return '';
		const d = new Date(ms);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
			d.getHours(),
		)}:${pad(d.getMinutes())}`;
	},
	set(v: string) {
		if (!v) return;
		const ms = new Date(v).getTime();
		if (!Number.isNaN(ms)) emit('update:modelValue', ms);
	},
});
</script>

<template>
	<input
		v-model="localValue"
		type="datetime-local"
		class="schedule-input"
	/>
</template>
