<template>
  <div
    class="contact-card-emails"
    :class="[`contact-card-emails--${props.size}`]"
  >
    <ul>
      <li
        v-for="({ id, email, type, primary }, idx) of emails"
        :key="id"
        class="contact-card-emails__item"
      >
        <wt-divider v-if="idx"></wt-divider>
        <div class="contact-card-emails__wrapper">
          <div class="contact-card-emails__inner">
            <p>{{ email }}</p>
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

const emails = computed(() => props.contact.emails);
</script>

<style lang="scss" scoped>
.contact-card-emails {
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
    .contact-card-emails__wrapper {
      display: block;
    }
  }
}
</style>
