<template>
  <section class="flow-button">
    <wt-button
      color="success"
      :loading="isLoading"
      @click="runFlow"
    >
      {{ $t('reusable.run') }}
    </wt-button>
  </section>
</template>

<script setup>
/* created new button component because we need logic for loading until we get api response
 task: https://webitel.atlassian.net/browse/WTEL-4355 */

import { ref } from 'vue';
import FlowsAPI from '../api/flows.js';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const isLoading = ref(false);

async function runFlow () {
  try {
    isLoading.value = true;
    await FlowsAPI.run(props.id);
  } finally {
    isLoading.value = false;
  }
}

</script>
