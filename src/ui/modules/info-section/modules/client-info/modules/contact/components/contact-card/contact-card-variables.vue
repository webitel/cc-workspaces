<template>
  <wt-expansion-panel
    :size="props.size"
    collapsed>
    <template v-slot:title>{{ t('infoSec.contacts.attributes', 2) }}</template>
    <template>
      <div
        class="contact-card-variables"
        :class="[`contact-card-variables--${props.size}`]"
      >
        <ul v-if="props.variables.length">
          <li
            v-for="({ key, value, id }, idx) of props.variables"
            :key="id"
            class="contact-card-variables__item"
          >
            <wt-divider v-if="idx"></wt-divider>
            <div class="contact-card-variables__inner">
              <p>{{ key }}</p>
              <p>{{ value }}</p>
            </div>
          </li>
        </ul>
        <div v-else>{{ t('infoSec.contacts.emptyAttributes') }}
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
.contact-card-variables {
  padding: var(--spacing-xs);

  &__item {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
  }

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: var(--spacing-xs) 0;

  }

  &--sm {
    .contact-card-variables__inner {
      display: block;
    }
  }
}
</style>
