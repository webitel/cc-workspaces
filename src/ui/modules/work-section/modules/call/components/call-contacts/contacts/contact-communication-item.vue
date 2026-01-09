<template>
  <div
    class="contact-communications-item"
    :class="`contact-communications-item--size-${size}`"
  >
    <div class="contact-communications-item__before">
      <wt-icon
        v-if="phone.primary"
        :size="size"
        icon="tick"
        color="success"
      />
    </div>
    <div class="contact-communications-item__main">
      <span class="contact-communications-item__title">{{ phone.number }}</span>
    </div>
    <div class="contact-communications-item__after">
      <wt-icon-btn
        icon="call--filled"
        color="success"
        :size="size"
        @click="emit('call', phone)"
      ></wt-icon-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
  phone: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['call']);
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.contact-communications-item {
  display: grid;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  transition: var(--transition);

  &--size {
    &-sm {
      grid-template-columns: var(--icon-sm-size) 1fr var(--icon-sm-size);
    }
    &-md {
      grid-template-columns: var(--icon-md-size) 1fr var(--icon-md-size);
    }
  }

  &:hover {
    border-color: var(--primary-color);
  }

  &__title {
    @extend %typo-body-2;
    overflow-wrap: anywhere;
  }
}

.contact-communications-item__before,
.contact-communications-item__after {
  line-height: 0;
}
</style>
