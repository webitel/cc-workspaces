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
      <span class="contact-communications-item__title typo-body-2">{{ phone.number }}</span>
    </div>
    <div class="contact-communications-item__after">
      <wt-icon-btn
        icon="call--filled"
        color="success"
        :size="size"
        :disabled="showDisabled"
        @click="emit('call', phone)"
      ></wt-icon-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	size: {
		type: String,
		default: 'md',
	},
	phone: {
		type: Object,
		required: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'call',
]);

// sinhronizetion with loader on wt-rounded-action
// TODO: change disable to loading in task https://webitel.atlassian.net/browse/WTEL-9803
const showDisabled = ref(false);

watch(
	() => props.loading,
	(value) => {
		if (value) {
			showDisabled.value = true;
		} else {
			setTimeout(() => {
				showDisabled.value = false;
			}, 1000);
		}
	},
);
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
    overflow-wrap: anywhere;
  }
}

.contact-communications-item__before,
.contact-communications-item__after {
  line-height: 0;
}
</style>
