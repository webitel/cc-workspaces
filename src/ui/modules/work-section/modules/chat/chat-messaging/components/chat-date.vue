<template>
  <div class="chat-date typo-subtitle-1">
    {{ formattedDate }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import prettifyDate from '../scripts/prettifyDate.js';

const props = defineProps({
	date: {
		type: String,
		required: true,
	},
});

const { t } = useI18n();

const formattedDate = computed(() => {
	const chatDate = prettifyDate(props.date);
	const today = prettifyDate(Date.now());

	return chatDate === today ? t('reusable.today') : chatDate;
});
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-date {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
