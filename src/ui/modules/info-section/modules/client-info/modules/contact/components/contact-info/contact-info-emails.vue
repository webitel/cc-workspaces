<template>
  <div class="contact-info-emails"
       :class="[`contact-info-emails--${props.size}`]">
    <ul>
      <li
        v-for="(email, key) of emails" :key="key"
        class="contact-info-emails__item"
      >
        <div>{{ email.name }}</div>
        <div>{{ email.type }}</div>
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

const emails = reactive([
  {
    name: 'kjfdflk@gmail.com',
    type: 'type',
  },
  {
    name: 'kjfdflk5465156@gmail.com',
    type: 'type',
  },
]);
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
