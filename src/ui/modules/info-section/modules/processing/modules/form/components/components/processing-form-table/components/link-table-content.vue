<template>
  <div class="link-table-content">
    <a v-if="props.value && !isValueArray"
      :href="props.value"
       class="link-table-content__link"
       target="_blank"
    >
      {{ props.value }}
    </a>

    <ul v-else-if="props.value && isValueArray">
      <li v-for="(link, index) in props.value"
          :key="index"
      >
        <a :href="link"
           target="_blank"
           class="link-table-content__link"
        >
          {{ link }}
        </a>,
      </li>
    </ul>

    <span v-else> {{ EMPTY_SYMBOL }} </span>
  </div>
</template>

<script setup lang="ts">

import { computed, defineProps } from 'vue';
import { EMPTY_SYMBOL } from '../scripts/tableEmptySymbol';

interface Props {
  value?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
});

const isValueArray = computed(() => Array.isArray(props.value))

</script>

<style scoped>
.link-table-content__link {
  color: var(--link-color);
}
</style>
