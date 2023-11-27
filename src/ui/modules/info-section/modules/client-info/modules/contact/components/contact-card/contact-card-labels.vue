<template>
  <wt-expansion-panel :size="props.size">
    <template v-slot:title>{{ t('vocabulary.labels', 2) }}</template>
    <template>
        <div class="contact-info-labels">
          <wt-chip
            v-for="({ label, id }) of props.labels"
            :key="id"
          >{{ label }}
          </wt-chip>
        </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  labels: {
    type: Array,
  },
});
</script>

<style lang="scss" scoped>
.contact-info-labels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
}
</style>
