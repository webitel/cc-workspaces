<template>
  <div class="number-table-content">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

interface Props {
	value?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
	value: 0,
});

const content = computed(() =>
	Array.isArray(props.value) ? props.value.join(', ') : props.value,
);
</script>
