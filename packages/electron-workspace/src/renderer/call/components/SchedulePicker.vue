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

<style scoped>
.schedule-input {
	margin: 20px 30px 0;
	padding: 8px 10px;
	font-family: Montserrat;
	font-size: 14px;
	border: 1px solid #e0e7eb;
	border-radius: 5px;
	outline: none;
	background: #ffffff;
	color: #030302;
	-webkit-app-region: no-drag;
}
</style>
