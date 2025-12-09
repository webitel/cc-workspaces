<template>
  <div class="date-time-table-content">
    {{ dataTimeValue }}
  </div>
</template>

<script setup lang="ts">
import { FormatDateMode } from '@webitel/ui-sdk/enums';
import { formatDate } from '@webitel/ui-sdk/utils';
import { computed, defineProps } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const dataTimeValue = computed<string>(() =>  {
  return formatDate(+props.value, FormatDateMode.DATETIME)
})

</script>
