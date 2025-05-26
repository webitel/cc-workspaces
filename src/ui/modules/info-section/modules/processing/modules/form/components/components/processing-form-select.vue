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
import { computed, onMounted, ref, watch, withDefaults } from 'vue';

const props = withDefaults(defineProps<{
    value: never;
    options?: never[];
  }>(), {
    options: () => [],
  })
;

const emit = defineEmits<{
  (e: 'input', value: never): void;
}>();

const initialValue = ref(null);
const trackBy = computed(() => {
  return typeof props.options[0] === 'object' ? 'value' : null;
});

onMounted(() => {
  if (Array.isArray(props.value)) {
    return initialValue.value = (props.value as never[]).map((value) => {
      return props.options.find((option) => option.value === value) || value;
    });
  }
  initialValue.value = props.options.find((option) => option.value === props.value) || props.value;
});

watch(() => props.value, (newValue) => {
  if (Array.isArray(newValue) && (newValue as never[]).some(item => typeof item !== 'object')) {
    const values = (newValue as never[]).map(item => {
      return props.options.find((option) => option.value === item) || item;
    });
    emit('input', values);
    return;
  }


  if (typeof newValue === 'object') {
    return;
  } else {
    const existsOption = props.options.find((option) => {
      return option.value === newValue;
    });

    if (existsOption) {
      emit('input', existsOption);
    }
  }
}, { immediate: true });

const resetValue = () => {
  emit('input', initialValue.value);
};
</script>
