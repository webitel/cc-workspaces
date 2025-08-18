<template>
  <div class="date-time-table-content">
    {{ dataTimeValue }}
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const dataTimeValue = computed<string>(() =>  {
  return new Date(+props.value).toLocaleString()
})

</script>
