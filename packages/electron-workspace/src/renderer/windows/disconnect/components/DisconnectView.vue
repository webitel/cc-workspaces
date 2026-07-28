<template>
	<div class="disconnect-view">
		<img
			class="disconnect-image"
			:src="iconDisconnect"
			alt=""
			width="122"
			height="126"
		/>
		<p class="disconnect-text">
			{{ t('Text') }}
		</p>
		<wt-button
			@click="connect"
		>
			{{ t('Connect') }}
		</wt-button>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import iconDisconnect from '../assets/disconnect-img.svg';

const { t } = useI18n();

const ipcRenderer =
	typeof require === 'function' ? require('electron').ipcRenderer : null;

function connect() {
	ipcRenderer?.send('reload-page');
	ipcRenderer?.send('hide-disconnect-popup');
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400|Ubuntu:400");

.disconnect-view {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	gap: 10px;
	padding: 10px;
}

.disconnect-image {
	display: block;
	width: 122px;
	height: 126px;
}

.disconnect-text {
	font-family: Montserrat;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 18px;
	appearance: auto;
	color: #030302;
	width: 200px;
}
</style>
