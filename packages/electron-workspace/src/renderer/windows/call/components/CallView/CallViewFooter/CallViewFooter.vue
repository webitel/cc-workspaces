<template>
    <footer class="call-view-footer">
        <CallViewActiveFooter
            v-if="active"
            :is-muted="isMuted"
            :is-hold="isHold"
            @ringing:accept="emit('ringing:accept')"
            @ringing:reject="emit('ringing:reject')"
            @active:mute="emit('active:mute')"
            @active:unmute="emit('active:unmute')"
            @active:hold="emit('active:hold')"
            @active:unhold="emit('active:unhold')"
            @active:hangup="emit('active:hangup')"
        />
        <CallViewRingingFooter
            v-else
            @ringing:accept="emit('ringing:accept')"
            @ringing:reject="emit('ringing:reject')"
        />
    </footer>
</template>

<script
    setup
    lang="ts"
>
import CallViewActiveFooter from './CallViewActiveFooter.vue';
import CallViewRingingFooter from './CallViewRingingFooter.vue';

const props = defineProps<{
	active: boolean;
	isMuted: boolean;
	isHold: boolean;
}>();

const emit = defineEmits<{
	'ringing:accept': [];
	'ringing:reject': [];

	'active:mute': [];
	'active:unmute': [];
	'active:hold': [];
	'active:unhold': [];
	'active:hangup': [];
}>();
</script>

<style scoped>
.call-view-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>