<template>
    <wt-button
        v-if="!isMuted"
        icon="mic"
        color="secondary"
        @click="emit('mute')"
    />
    <wt-button
        v-else
        icon="mic-muted"
        color="secondary"
        @click="emit('unmute')"
    />
    <wt-button
        v-if="!isHold"
        icon="hold"
        color="secondary"
        @click="emit('hold')"
    />
    <wt-button
        v-else
        icon="pause"
        @click="emit('unhold')"
    />
    <wt-button
        icon="call-end"
        color="error"
        @click="emit('hangup')"
    />
</template>

<script
	setup
	lang="ts"
>
defineProps<{
	isMuted: boolean;
	isHold: boolean;
}>();

const emit = defineEmits<{
	mute: [];
	unmute: [];
	hold: [];
	unhold: [];
	hangup: [];
}>();
</script>

<style scoped></style>
