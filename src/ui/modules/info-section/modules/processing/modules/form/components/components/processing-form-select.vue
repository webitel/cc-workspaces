<template>
  <wt-select
    v-bind="$attrs"
    :value="value"
    :options="options"
    :track-by="trackBy"
    @reset="resetValue"
    @input="emit('input', $event)"
  ></wt-select>
</template>

<script setup lang="ts">
import deepEqual from 'deep-equal';
import { computed, onMounted, ref, watch, withDefaults } from 'vue';

const props = withDefaults(
	defineProps<{
		value: never;
		options?: never[];
	}>(),
	{
		options: () => [],
	},
);

const emit = defineEmits<(e: 'input', value: never) => void>();

const initialValue = ref(null);
const trackBy = computed(() => {
	return typeof props.options[0] === 'object' ? 'value' : null;
});

onMounted(() => {
	if (Array.isArray(props.value)) {
		return (initialValue.value = (props.value as never[]).map((value) => {
			return props.options.find((option) => option.value === value) || value;
		}));
	}
	initialValue.value =
		props.options.find((option) => option.value === props.value) || props.value;
});

// @author @stanislav-kozak
// This function checks if the value is an array of primitive types (string, number, boolean)
const isPrimitiveArray = (
	value: unknown,
): value is (string | number | boolean)[] =>
	Array.isArray(value) && value.some((item) => typeof item !== 'object');

// @author @stanislav-kozak
// This function maps an array of primitive values to their corresponding options
const mapToOptions = (value: (string | number | boolean)[], options: any[]) =>
	value.map((item) => options.find((option) => option.value === item) || item);

// @author @stanislav-kozak
// This function finds the first option that matches the value
const findMatchingOption = (value: unknown, options: any[]) =>
	options.find((option) => option.value === value);

watch(
	() => props.value,
	(newValue) => {
		// @author @stanislav-kozak
		// If the new value is an array of primitive types, map it to options
		if (isPrimitiveArray(newValue)) {
			const mappedValues = mapToOptions(newValue, props.options);

			// @author @stanislav-kozak
			// If the mapped values are the same as the initial value, do not emit
			if (!deepEqual(mappedValues, newValue)) {
				emit('input', mappedValues);
			}
			return;
		}

		// @author @stanislav-kozak
		// If the value is not an array or is not primitive, find the matching option
		if (typeof newValue !== 'object') {
			const matchedOption = findMatchingOption(newValue, props.options);

			if (matchedOption) {
				emit('input', matchedOption);
			}
		}
	},
	{
		immediate: true,
	},
);

const resetValue = () => {
	emit('input', '');
};
</script>
