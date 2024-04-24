<template>
  <section class="flow-button">
    <wt-button color="success"> run </wt-button>
  </section>
</template>

<script setup>

import { computed, onMounted, defineProps } from 'vue';
import FlowsAPI from '../api/flows.js';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

// логіка для лоадінга

</script>
