<template>
  <div class="contact-card-phones"
       :class="[`contact-card-phones--${props.size}`]">
    <ul>
      <li
        v-for="({ id, number, type, primary }) of phones" :key="id"
        class="contact-card-phones__item"
      >
        <div class="contact-card-phones__wrapper">
          <div>{{ number }}</div>
          <wt-icon
            v-if="primary"
            icon="tick"
            color="success"
          ></wt-icon>
        </div>
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
.contact-card-phones {
  &__item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: flex-start;
    padding: var(--spacing-xs);

    &:not(:last-child) {
      border-bottom: 1px solid var(--secondary-color);
    }
  }

  &__wrapper {
    display: flex;
    gap: var(--spacing-xs)
  }

  &--sm {
    .contact-card-phones__item {
      display: block;
    }
  }
}
</style>
