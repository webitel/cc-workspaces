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

<style>
.success-message {
	width: 260px;
	height: 184px;
	background: #f7f7f7;
	-webkit-app-region: drag;
}
.success-message__dane {
	background-image: url("@img/dane-default-bttn.svg");
	margin-top: 49px;
	margin-left: 121px;
	height: 12px;
	width: 18px;
}
.title {
	margin-top: 30px;
	justify-content: center;
	font-family: Montserrat;
	font-weight: 600;
	align-items: center;
	display: flex;
	font-size: 14px;
	line-height: 18px;
	color: #030302;
	-webkit-app-region: drag;
}
.control-button {
	border-radius: 20px;
	border: none;
	outline: none;
	-webkit-app-region: no-drag;
}
#closeBtn:hover {
	opacity: 1;
}
#closeBtn {
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	width: 74px;
	height: 38px;
	color: #f7f7f7;
	border: none;
	background: #ffc000;
	opacity: 0.8;
	border-radius: 5px;
	margin-top: 10px;
	margin-left: 93px;
}
</style>
