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
import { computed, onMounted, ref, withDefaults } from 'vue';

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
  initialValue.value = props.options.find((option) => option.value === props.value);

  if (initialValue.value) {
    emit('input', initialValue.value);
  } else {
    initialValue.value = props.value;
  }
});

const resetValue = () => {
  emit('input', initialValue.value);
};
</script>
