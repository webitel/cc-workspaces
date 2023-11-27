<template>
  <div class="contact-info-emails"
       :class="[`contact-info-emails--${props.size}`]">
    <ul>
      <li
        v-for="({ id, email, type }) of emails" :key="id"
        class="contact-info-emails__item"
      >
        <div>{{ email }}</div>
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
.contact-info-emails {
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
    .contact-info-emails__item {
      display: block;
    }
  }
}

</style>
