<template>
  <header
    class="contact-header"
  >
    <div>
      <wt-icon-btn
        v-if="props.isPrev"
        icon="back"
        @click="emit('prev')"
      ></wt-icon-btn>
    </div>
    <p>{{ title }}</p>
    <div>
      <wt-icon-btn
        v-if="props.isNext"
        icon="send-arrow"
        @click="emit('next')"
      ></wt-icon-btn>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	isNext: {
		type: Boolean,
		default: false,
	},
	isPrev: {
		type: Boolean,
		default: false,
	},
	length: {
		type: Number,
		default: 0,
	},
	index: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits([
	'next',
	'prev',
]);

const { t } = useI18n();

const current = computed(() => props.index + 1);

const title = computed(() => {
	if (props.length === 1) {
		return t('infoSec.contacts.foundOneContact', {
			count: props.length,
		});
	} else {
		return t('infoSec.contacts.foundSomeContact', {
			current: current.value,
			count: props.length,
		});
	}
});
</script>
<style lang="scss" scoped>
.contact-header {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs);
  border: 1px solid var(--wt-table-head-border-color);
  border-radius: var(--spacing-2xs);
}
</style>
