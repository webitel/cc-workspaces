<template>
	<LoadConfigView />
</template>

<script setup lang="ts">
import LoadConfigView from './components/LoadConfigView.vue';
</script>

<style>

html {
	height: 100%;
	width: 100%;
}
body {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	-webkit-app-region: drag;
}
</style>
