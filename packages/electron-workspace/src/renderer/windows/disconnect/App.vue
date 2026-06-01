<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import iconDisconnect from '@img/disconnect-img.svg';

const { t } = useI18n();

const ipcRenderer =
	typeof require === 'function' ? require('electron').ipcRenderer : null;

function connect() {
	ipcRenderer?.send('reload-page');
	ipcRenderer?.send('hide-disconnect-popup');
}
</script>

<template>
	<div class="content">
		<div
			class="app-icon"
			:style="{ backgroundImage: `url(${iconDisconnect})` }"
		></div>
		<span class="text-lable">{{ t('Text') }}</span>
		<button
			id="connectBtn"
			class="connect-btn"
			type="button"
			@click="connect"
		>
			{{ t('Connect') }}
		</button>
	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400|Ubuntu:400");

html {
	height: 100%;
}
body {
	margin: 0;
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background: #f7f7f7;
	-webkit-app-region: drag;
}
.content {
	text-align: -webkit-center;
}
.app-icon {
	width: 122px;
	height: 126px;
	margin-top: 10px;
	margin-bottom: 10px;
	background-size: contain;
	background-repeat: no-repeat;
}
.connect-btn {
	margin-top: 10px;
	-webkit-app-region: no-drag;
	border: none;
	outline: none;
}
.text-lable {
	font-family: Montserrat;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 18px;
	appearance: auto;
	color: #030302;
	width: 200px;
}
#connectBtn {
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	height: 38px;
	color: #f7f7f7;
	border: none;
	opacity: 0.8;
	background: #2ba329;
	box-shadow:
		inset 1px 1px 2px #ffffff,
		inset -2px -2px 2px rgba(0, 0, 0, 0.15);
	border-radius: 20px;
	margin: 10px;
}
#connectBtn:hover {
	opacity: 1;
}
</style>
