<template>
    <wt-button icon="mute" v-if="!isMuted" />
    <wt-button icon="unmute" v-if="isMuted" />
    <wt-button icon="hold" v-if="isHold" />
    <wt-button icon="unhold" v-if="!isHold" />
    <wt-button icon="hangup" />
</template>

<script setup lang="ts">
const props = defineProps<{
	isMuted: boolean;
	isHold: boolean;
}>();
</script>

<style scoped>
</style>