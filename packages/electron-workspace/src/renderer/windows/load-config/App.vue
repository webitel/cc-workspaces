<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import iconApp from '@img/app-icon.svg';
import iconClose from '@img/icon-close-md.svg';
import iconCollaps from '@img/icon-collaps-md.svg';
import iconExpand from '@img/icon-expand-md.svg';

const { t } = useI18n();

const ipcRenderer =
	typeof require === 'function' ? require('electron').ipcRenderer : null;

function uploadFile() {
	ipcRenderer?.send('file-open');
}

function onCollaps() {
	ipcRenderer?.send('collaps-load-window');
}

function onExpand() {
	ipcRenderer?.send('expand-load-window');
}

function onClose() {
	ipcRenderer?.send('close-load-window');
}

function onFromMain(_event: unknown, err: string = '') {
	alert(err);
	console.error(err);
}

onMounted(() => ipcRenderer?.on('from-main', onFromMain));
onUnmounted(() => ipcRenderer?.removeListener('from-main', onFromMain));
</script>

<template>
	<div class="header">
		<div
			class="app-icon"
			:style="{ backgroundImage: `url(${iconApp})` }"
		></div>
		<div class="controls">
			<input
				id="collapsBtn"
				class="collaps-btn"
				type="image"
				:src="iconCollaps"
				name="collapsBtn"
				alt="collaps"
				@click="onCollaps"
			/>
			<input
				id="expandBtn"
				class="expand-btn"
				type="image"
				:src="iconExpand"
				name="expandBtn"
				alt="expand"
				@click="onExpand"
			/>
			<input
				id="closeBtn"
				class="close-btn"
				type="image"
				:src="iconClose"
				name="closeBtn"
				alt="close"
				@click="onClose"
			/>
		</div>
	</div>
	<div class="content">
		<span class="text-lable">{{ t('uploadConfigurationText') }}</span>
		<button
			id="selectFileBtn"
			class="select-file-btn"
			type="button"
			@click="uploadFile"
		>
			{{ t('UploadFile') }}
		</button>
	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900|Ubuntu:300,400,500,600,700,800,900");

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
.app-icon {
	width: 24px;
	height: 24px;
	margin: 10px 0 0 15px;
}
.content {
	display: grid;
	margin: 0;
	position: absolute;
	top: 50%;
	transform: translate(0, -50%);
	text-align-last: center;
	margin-top: 15px;
	width: -webkit-fill-available;
}
#selectFileBtn {
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	padding: 12px 20px;
	position: static;
	height: 38px;
	color: #f7f7f7;
	border: none;
	background: #ffc000;
	opacity: 0.8;
	border-radius: 5px;
	flex: none;
	order: 0;
	flex-grow: 0;
	justify-self: center;
	margin-top: 30px;
}
#selectFileBtn:hover {
	opacity: 1;
}
.text-lable {
	font-family: Montserrat;
	font-style: normal;
	text-align: center;
	white-space: pre-line;
	font-weight: 600;
	font-size: 12px;
	line-height: 14px;
	color: #030302;
}
.collaps-btn,
.expand-btn,
.close-btn {
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
}
.controls {
	position: absolute;
	right: 15px;
	top: 10px;
}
.expand-btn,
.close-btn {
	margin-left: 10px;
}
.select-file-btn,
.collaps-btn,
.expand-btn,
.close-btn {
	-webkit-app-region: no-drag;
	border: none;
	outline: none;
}
input[id="collapsBtn"]:hover {
	background-image: url("@img/icon-collaps-hover-md.svg");
}
input[id="expandBtn"]:hover {
	background-image: url("@img/icon-expand-hover-md.svg");
}
input[id="closeBtn"]:hover {
	background-image: url("@img/icon-close-hover-md.svg");
}
</style>
