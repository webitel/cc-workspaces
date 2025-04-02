<template>
  <wt-select
    v-if="multiselect"
    :label="object.source?.name"
    :search-method="loadObjectList({
      path: object.source?.path,
      primary: 'id',
      display: object.displayColumn,
    })"
    :value="value"
    track-by="id"
    use-value-from-options-by-prop="id"
    clearable
    multiple
    @input="emit('input', $event)"
  >
  </wt-select>
  <wt-select
    v-else
    :label="object.source?.name"
    :search-method="loadObjectList({
      path: object.source?.path,
      primary: 'id',
      display: object.displayColumn,
    })"
    :value="value"
    track-by="id"
    use-value-from-options-by-prop="id"
    clearable
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
  multiselect: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['input']);

const loadObjectList = ({ path, display, primary }) => {
  return () => {
    return ObjectApi.getLookup({ path, display, primary });
  };
};
</script>

<style lang="scss" scoped>

</style>
