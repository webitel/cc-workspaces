<template>
    <header class="call-view-header">
        <wt-icon :icon="icon" />
        <div class="call-view-header__text">
            <h3 class="call-view-header__title">
                {{ title || subtitle }}
            </h3>
            <p class="call-view-header__subtitle">
                {{ subtitle }}
            </p>
        </div>
        <span class="call-view-header__duration">
            {{ duration }}
        </span>
        <wt-button color="secondary" icon="close" @click="emit('close')" />
    </header>
</template>

<script
	setup
	lang="ts"
>
import { computed } from 'vue';

const props = defineProps<{
	title: string;
	subtitle: string;
	duration: string;
	answered: boolean;
	isHold: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

const icon = computed(() => {
	if (!props.answered) return 'call-ringing';
	return props.isHold ? 'hold' : 'call';
});
</script>

<style scoped>
.call-view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.call-view-header__text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.call-view-header__title {
    font-size: 16px;
    line-height: 2;
    font-weight: 600;
}

.call-view-header__subtitle {
    font-size: 12px;
    line-height: 1.4;
}

.call-view-header__duration {
    font-size: 12px;
    line-height: 2;
}
</style>
