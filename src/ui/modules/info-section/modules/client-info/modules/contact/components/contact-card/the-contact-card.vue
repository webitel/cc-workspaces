<template>
  <div class="contact-card">
    <general
      :contact="props.contact"
      :size="props.size"
      :linked="props.linked"
      @link="emit('link')"
    />
    <labels
      :labels="labels"
      :size="props.size"
    />
    <variables
      :variables="variables"
      :size="props.size"
    />
    <description
      :description="description"
      :size="props.size"
    />
    <communications
      :contact="props.contact"
      :size="props.size"
      :linked="props.linked"
    />
  </div>
</template>
<script setup>
import { computed } from 'vue';

import Communications from './contact-card-communications.vue';
import Description from './contact-card-description.vue';
import General from './contact-card-general.vue';
import Labels from './contact-card-labels.vue';
import Variables from './contact-card-variables.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
  contact: {
    type: Object,
    required: true,
  },
  linked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'link',
]);

const labels = computed(() => props.contact?.labels);
const variables = computed(() => props.contact?.variables);
const description = computed(() => props.contact?.about);
</script>

<style lang="scss" scoped>
.contact-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
}
</style>
