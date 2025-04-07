<template>
  <wt-select
    :label="object.source?.name"
    :search-method="loadObjectList({
      path: object.source?.path,
      primary: 'id',
      display: object.displayColumn,
    })"
    :value="value"
    clearable
    :multiple="multiple"
    @input="emit('input', $event)"
  >
  </wt-select>
</template>

<script setup>
import { defineProps } from 'vue';

import ObjectApi from './api/objects.js';

defineProps({
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
});

const emit = defineEmits(['input']);

const loadObjectList = ({ path, display, primary }) => {
  return (params) => {
    return ObjectApi.getLookup({ path, display, primary, ...params });
  };
};
</script>
