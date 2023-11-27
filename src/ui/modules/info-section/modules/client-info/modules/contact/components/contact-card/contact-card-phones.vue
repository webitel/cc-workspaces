<template>
  <div class="contact-info-phones"
       :class="[`contact-info-phones--${props.size}`]">
    <ul>
      <li
        v-for="({ id, number, type }) of phones" :key="id"
        class="contact-info-phones__item"
      >
        <div>{{ number }}</div>
        <div>{{ type.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
  },
});

const phones = computed(() => props.contact.phones);
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
