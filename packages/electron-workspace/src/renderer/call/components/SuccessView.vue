<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAutoResize } from '../composables/useAutoResize';
import { closeSuccessMessage } from '../composables/useCallIPC';

const { t } = useI18n();
const root = ref<HTMLDivElement | null>(null);
let timerId: ReturnType<typeof setTimeout> | null = null;

useAutoResize(root, 259);

onMounted(() => {
	timerId = setTimeout(() => {
		closeSuccessMessage();
		timerId = null;
	}, 2000);
});

onBeforeUnmount(() => {
	if (timerId) {
		clearTimeout(timerId);
		timerId = null;
	}
});

function onCloseClick() {
	if (timerId) {
		clearTimeout(timerId);
		timerId = null;
	}
	closeSuccessMessage();
}
</script>

<template>
	<div
		ref="root"
		class="success-message"
	>
		<div class="success-message__dane"></div>
		<div
			class="title"
			style="margin-top: 29.67px;"
		>
			{{ t('Saved') }}
		</div>
		<button
			id="closeBtn"
			class="control-button"
			type="button"
			@click="onCloseClick"
		>
			{{ t('Close') }}
		</button>
	</div>
</template>
