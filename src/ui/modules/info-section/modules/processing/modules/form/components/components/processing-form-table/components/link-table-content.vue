<template>
  <div>
    <a :href="props.value" target="_blank">
      {{ props.value }}
    </a>
  </div>
</template>

<script setup lang="ts">

import { defineProps } from 'vue';

interface Props {
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
});

</script>
