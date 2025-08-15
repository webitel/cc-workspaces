<template>
  <div class="number-table-content">
    {{ props.value }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  value?: string | number | boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
});

</script>
