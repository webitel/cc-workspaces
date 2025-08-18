<template>
  <div>
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">

import { computed, defineProps } from 'vue';

interface Props {
  value?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  value: '-',
});

const text = computed(() => Array.isArray(props.value) ? props.value.join(', ') : props.value);

</script>
