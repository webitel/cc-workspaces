<template>
  <section class="flow-button">
    <wt-button
      color="success"
      :loading="isLoading"
      @click="runFlow"
    >
      run
    </wt-button>
  </section>
</template>

<script setup>

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
    console.log('finally FlowApi');
    isLoading.value = false;
  }
}

</script>
