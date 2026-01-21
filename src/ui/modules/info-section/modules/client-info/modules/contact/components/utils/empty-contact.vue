<template>
  <div
    class="empty-contact"
    :class="[`empty-contact--${props.size}`]"
  >
    <wt-avatar size="2xl"/>
    <p class="empty-contact__title typo-heading-2">{{ $t('infoSec.contacts.emptyContact') }}</p>

    <wt-button
      v-if="allowAddition"
      class="empty-contact__button"
      @click="add"
    > {{ $t('reusable.add') }}
    </wt-button>
  </div>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';

const props = defineProps({
  size: {
    type: String,
    default: ComponentSize.MD,
    options: ['sm', 'md'],
  },
  allowAddition: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['add']);

function add() {
  emit('add');
}
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.empty-contact {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  align-items: center;

  &__title {
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
