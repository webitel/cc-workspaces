<template>
  <wt-multi-select
		v-if="multiple"
    v-bind="$attrs"
    :label="label || object.source?.name"
    :search-method="loadObjectList"
    :model-value="value"
    :multiple="multiple"
    @update:model-value="emit('input', $event)"
  />

	<wt-single-select
		v-else
    v-bind="$attrs"
    :label="label || object.source?.name"
    :search-method="loadObjectList"
    :model-value="value"
    @update:model-value="emit('input', $event)"
  />
</template>

<script setup>
import { computed, defineProps } from 'vue';

import ObjectApi from './api/objects.js';

const props = defineProps({
	value: {
		type: String,
		required: true,
	},
	object: {
		type: Object,
		required: true,
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: '',
	},
});

const emit = defineEmits([
	'input',
]);

const filters = computed(() => props?.object.filters || []);
const fields = computed(() => props?.object.fields || []);

const loadObjectList = (params) => {
	return ObjectApi.getLookup({
		...params,
		path: props.object?.source?.path,
		filters: filters.value,
		fields: fields.value,
		primary: 'id',
		display: props.object?.displayColumn,
	});
};
</script>
