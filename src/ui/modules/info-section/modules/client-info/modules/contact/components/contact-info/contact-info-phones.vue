<template>
  <div class="contact-info-phones"
       :class="[`contact-info-phones--${props.size}`]">
    <ul>
      <li
        v-for="(phone, key) of phones" :key="key"
        class="contact-info-phones__item"
      >
        <div>{{ phone.name }}</div>
        <div>{{ phone.type }}</div>
      </li>
    </ul>
  </div>
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

const phones = reactive([
  {
    name: '+32222222',
    type: 'type',
  },
  {
    name: '+39654555',
    type: 'type',
  },
]);
</script>

<style lang="scss" scoped>
.contact-info-phones {
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
    .contact-info-phones__item {
      display: block;
    }
  }
}

</style>
