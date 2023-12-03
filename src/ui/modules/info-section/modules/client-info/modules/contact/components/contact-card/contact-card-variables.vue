<template>
  <wt-expansion-panel :size="props.size">
    <template v-slot:title>{{ t('vocabulary.variables', 2) }}</template>
    <template>
      <div
        class="contact-card-variables"
        :class="[`contact-card-variables--${props.size}`]"
      >
        <ul v-if="props.variables.length">
          <li
            v-for="({ key, value, id }) of props.variables"
            :key="id"
            class="contact-card-variables__item"
          >
            <div>{{ key }}</div>
            <div>{{ value }}</div>
          </li>
        </ul>
        <div v-else>{{
            t(
              'infoSec.contacts.emptyTab',
              { title: kebabCase(t('vocabulary.variables', 2)) },
            )
          }}
        </div>
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { kebabCase } from 'eslint-plugin-vue/lib/utils/casing';
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: flex-start;
    padding: var(--spacing-xs);

    &:not(:last-child) {
      border-bottom: 1px solid var(--secondary-color);
    }
  }

  &--sm {
    .contact-card-variables__item {
      display: block;
    }
  }
}
</style>
