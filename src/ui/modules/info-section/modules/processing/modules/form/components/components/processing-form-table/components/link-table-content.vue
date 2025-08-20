<template>
  <div class="link-table-content">
    <ul v-if="props.value">
      <li v-for="(link, index) in links"
          :key="index"
      >
        <a :href="link"
           target="_blank"
           class="link-table-content__link"
        >
          {{ link }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import { computed, defineProps } from 'vue';

interface Props {
  value?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
});

const links = computed(() => Array.isArray(props.value) ? props.value : [props.value]);

</script>

<style scoped>
.link-table-content__link {
  color: var(--link-color);
}
</style>
