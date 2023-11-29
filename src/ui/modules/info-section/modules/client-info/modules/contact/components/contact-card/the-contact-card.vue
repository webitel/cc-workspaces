<template>
  <div class="contact-info">
    <general
      :contact="props.contact"
      :size="props.size"
      :linked="props.linked"
      @link="emit('link')"
    />
    <labels
      v-if="!isEmpty(labels)"
      :labels="labels"
      :size="props.size"/>
    <variables
      v-if="!isEmpty(variables)"
      :variables="variables"
      :size="props.size"/>
    <description
      v-if="description"
      :description="description"
      :size="props.size"/>
    <communications
      v-if="isCommunications"
      :contact="props.contact"
      :size="props.size"/>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import Communications from './contact-card-communications.vue';
import Description from './contact-card-desc.vue';
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
const isCommunications = computed(() => !isEmpty(props.contact?.emails) || !isEmpty(props.contact?.phones));
</script>

<style lang="scss" scoped>
.contact-info {
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
}
</style>
