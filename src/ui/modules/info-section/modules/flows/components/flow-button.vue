<template>
    <wt-button
      color="success"
      :loading="isLoading"
      @click="runFlow"
      :size="size ? size : 'md'"
    >
      {{ $t('reusable.run') }}
    </wt-button>
</template>

<script setup>
/* created new button component because we need logic for loading until we get api response
 task: https://webitel.atlassian.net/browse/WTEL-4355 */

import { ref } from 'vue';
import FlowsAPI from '../api/flows.js';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    required: false,
  }
});

const isLoading = ref(false);

async function runFlow () {
  try {
    isLoading.value = true;
    await FlowsAPI.run(props.item);
  } finally {
    isLoading.value = false;
  }
}

</script>
