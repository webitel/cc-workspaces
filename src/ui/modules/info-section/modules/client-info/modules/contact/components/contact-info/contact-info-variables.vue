<template>
  <wt-expansion-panel :size="props.size">
    <template v-slot:title>{{ t('vocabulary.variables', 2) }}</template>
    <template>
      <div
        :class="[`contact-info-variables--${props.size}`]"
        class="contact-info-variables">
        <ul>
          <li
            v-for="(variable, key) of variables" :key="key"
            class="contact-info-variables__item">
            <div>{{ variable.name }}</div>
            <div>{{ variable.value }}</div>
          </li>
        </ul>
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
});

const variables = reactive([
  {
    name: 'var1',
    value: 'value1',
  },
  {
    name: 'var2',
    value: 'value2',
  }]);
</script>

<style lang="scss" scoped>
.contact-info-variables {
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
    .contact-info-variables__item {
      display: block;
    }
  }
}
</style>
