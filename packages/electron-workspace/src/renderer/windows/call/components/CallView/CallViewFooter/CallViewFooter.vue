<template>
    <footer class="call-view-footer">
        <CallViewActiveFooter
            v-if="active"
            :is-muted="isMuted"
            :is-hold="isHold"
            @mute="emit('active:mute')"
            @unmute="emit('active:unmute')"
            @hold="emit('active:hold')"
            @unhold="emit('active:unhold')"
            @hangup="emit('active:hangup')"
        />
        <CallViewRingingFooter
            v-else
            @accept="emit('ringing:accept')"
            @reject="emit('ringing:reject')"
        />
    </footer>
</template>

<script
	setup
	lang="ts"
>
import CallViewActiveFooter from './CallViewActiveFooter.vue';
import CallViewRingingFooter from './CallViewRingingFooter.vue';

defineProps<{
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
