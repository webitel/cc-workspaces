<template>
  <wt-expansion-panel
    :size="props.size"
    collapsed
  >
    <template v-slot:title>{{ t('vocabulary.labels', 2) }}</template>
    <template>
      <div class="contact-card-labels">
        <div
          v-if="props.labels.length"
          class="contact-card-labels__wrapper"
        >
          <wt-chip
            v-for="({ label, id }) of props.labels"
            :key="id"
          >{{ label }}
          </wt-chip>
        </div>
        <div v-else>{{ t('infoSec.contacts.emptyLabels') }}
        </div>
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

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

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.contact-card-labels {
  padding: var(--spacing-xs);

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
}
</style>
