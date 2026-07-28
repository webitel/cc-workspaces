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
	display: flex;
	align-items: center;
	justify-content: center;
	-webkit-app-region: drag;
}
</style>
