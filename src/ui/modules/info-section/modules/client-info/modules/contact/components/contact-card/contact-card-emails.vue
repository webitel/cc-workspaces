<template>
  <div
    class="contact-card-emails"
    :class="[`contact-card-emails--${props.size}`]"
  >
    <ul>
      <li
        v-for="({ id, email, type, primary }) of emails"
        :key="id"
        class="contact-card-emails__item"
      >
        <div class="contact-card-emails__wrapper">
          <div>{{ email }}</div>
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

const emails = computed(() => props.contact.emails.data);
</script>

<style lang="scss" scoped>
.contact-card-emails {
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
    .contact-card-emails__item {
      display: block;
    }
  }
}
</style>
