<template>
  <div class="boolean-table-content">
    <wt-icon
      :icon="`${props.value}-ic`"
      :color="props.value ? 'success' : 'error'"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
	value?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	value: false,
});
</script>

<style scoped></style>
