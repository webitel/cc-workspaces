<template>
  <div class="contact-info">
    <general :size="props.size" />
    <labels :size="props.size"/>
    <variables :size="props.size"/>
    <desc :size="props.size"/>
    <communications :size="props.size"/>
  </div>
</template>
<script setup>
import Communications from './contact-info-communications.vue';
import Desc from './contact-info-desc.vue';
import General from './contact-info-general.vue';
import Labels from './contact-info-labels.vue';
import Variables from './contact-info-variables.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
});
</script>

<style lang="scss" scoped>
.contact-info {
  padding: var(--spacing-xs);
}
</style>
