<template>
  <div class="empty-contact"
       :class="[`empty-contact--${props.size}`]">
    <wt-avatar
      size="2xl"
    ></wt-avatar>

    <p class="empty-contact__title">{{ t('emptyContact') }}</p>

    <wt-button
      class="empty-contact__button"
    > {{ t('reusable.add') }}
    </wt-button>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
});
</script>

<style lang="scss" scoped>
.empty-contact {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  align-items: center;

  &__title {
    @extend %typo-heading-2;
    flex-grow: 1;
  }

  &--sm {
      flex-direction: column;
      align-items: center;

    .empty-contact__button {
      width: 100%;
    }
  }
}
</style>
