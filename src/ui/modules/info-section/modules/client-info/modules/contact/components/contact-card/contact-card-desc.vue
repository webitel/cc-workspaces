<template>
  <wt-expansion-panel
    :size="props.size"
    class="contact-card-desc"
  >
    <template v-slot:title>{{ $t('vocabulary.description') }}</template>
    <template>
      <div class="contact-card-desc__text">
        <div v-if="props.description">
          {{ props.description }}
        </div>
        <div v-else>{{ $t(
          'infoSec.contacts.emptyTab',
          { title: kebabCase( $tc('vocabulary.description', 2) ) },
        ) }}</div>
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { kebabCase } from 'eslint-plugin-vue/lib/utils/casing';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  description: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.contact-card-desc__text {
  padding: var(--spacing-xs);
}
</style>
