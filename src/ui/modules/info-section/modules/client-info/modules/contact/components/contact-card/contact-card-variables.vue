<template>
  <wt-expansion-panel
    :size="props.size"
    collapsed>
    <template #title>{{ t('infoSec.contacts.attributes', 2) }}</template>
    <template #default>
      <div
        class="contact-card-variables"
        :class="[`contact-card-variables--${props.size}`]"
      >
        <ul v-if="props.variables?.length">
          <li
            v-for="({ key, value, id }, idx) of props.variables"
            :key="id"
            class="contact-card-variables-item"
          >
            <wt-divider v-if="idx"/>
            <div class="contact-card-variables-wrapper">
              <p class="contact-card-variables-item__key typo-subtitle-1">{{ key }}:</p>
              <p class="contact-card-variables-item__value">{{ value }}</p>
            </div>
          </li>
        </ul>
        <div v-else>
          {{ t('infoSec.contacts.emptyAttributes') }}
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
  variables: {
    type: Array,
  },
});

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.contact-card-variables {
  padding: var(--spacing-xs);

  &--sm {
    .contact-card-variables-wrapper {
      grid-template-columns: 1fr;
    }
  }
}

.contact-card-variables-item {
  display: flex;
  flex-direction: column;
  justify-items: flex-start;

}

.contact-card-variables-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
}

</style>
