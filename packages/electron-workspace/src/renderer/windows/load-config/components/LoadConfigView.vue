<template>
	<div class="load-config-view">
		<img
			class="load-config-image"
			:src="iconApp"
			alt=""
			width="24"
			height="24"
		/>
		<p class="load-config-text">
			{{ t('uploadConfigurationText') }}
		</p>
		<wt-button @click="uploadFile">
			{{ t('UploadFile') }}
		</wt-button>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import iconApp from '@img/app-icon.svg';

const { t } = useI18n();

const ipcRenderer =
	typeof require === 'function' ? require('electron').ipcRenderer : null;

function uploadFile() {
	ipcRenderer?.send('file-open');
}

function onFromMain(_event: unknown, err: string = '') {
	alert(err);
	console.error(err);
}

onMounted(() => ipcRenderer?.on('from-main', onFromMain));
onUnmounted(() => ipcRenderer?.removeListener('from-main', onFromMain));
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900|Ubuntu:300,400,500,600,700,800,900");

.load-config-view {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 10px;
}

.load-config-image {
	width: 24px;
	height: 24px;
}

.load-config-text {
	font-family: Montserrat;
	font-style: normal;
	text-align: center;
	white-space: pre-line;
	font-weight: 400;
	font-size: 14px;
	line-height: 18px;
}
</style>
