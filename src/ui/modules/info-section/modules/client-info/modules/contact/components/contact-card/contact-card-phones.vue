<template>
  <div
class="contact-card-phones"
       :class="[`contact-card-phones--${props.size}`]">
    <ul>
      <li
        v-for="({ id, number, type, primary }, idx) of phones"
        :key="id"
        class="contact-card-phones__item"
      >
        <wt-divider v-if="idx"></wt-divider>
        <div class="contact-card-phones__wrapper">
          <div class="contact-card-phones__inner">
            <p>{{ number }}</p>
            <wt-icon
              v-if="primary"
              icon="tick"
              color="success"
            ></wt-icon>
          </div>
          <p>{{ type.name }}</p>
        </div>
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
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: var(--spacing-xs);
  }

  &__inner {
    display: flex;
    gap: var(--spacing-xs);
  }

  &--sm {
    .contact-card-phones__wrapper {
      display: block;
    }
  }
}
</style>
