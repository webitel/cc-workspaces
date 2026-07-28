<template>
	<DisconnectView />
</template>

<script setup lang="ts">
import DisconnectView from './components/DisconnectView.vue';
</script>

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
</style>
