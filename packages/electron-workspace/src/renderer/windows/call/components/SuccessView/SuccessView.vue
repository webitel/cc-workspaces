<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAutoResize } from '../../composables/useAutoResize';
import { closeSuccessMessage } from '../../composables/useCallIPC';

const { t } = useI18n();
const root = ref<HTMLDivElement | null>(null);
let timerId: ReturnType<typeof setTimeout> | null = null;

useAutoResize(root, 259);

function clearTimer() {
	if (timerId) {
		clearTimeout(timerId);
		timerId = null;
	}
}

onMounted(() => {
	timerId = setTimeout(() => {
		closeSuccessMessage();
		timerId = null;
	}, 2000);
});

onBeforeUnmount(clearTimer);

function onCloseClick() {
	clearTimer();
	closeSuccessMessage();
}
</script>

<template>
    <div
        ref="root"
        class="success-message"
    >
        <wt-icon
            icon="done"
            color="success"
            size="lg"
        />
        <span class="success-message__title">
            {{ t('Saved') }}
        </span>
        <wt-button
            color="warn"
            @click="onCloseClick"
        >
            {{ t('Close') }}
        </wt-button>
    </div>
</template>

<style scoped>
.success-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 260px;
    height: 184px;
    background: #f7f7f7;
    -webkit-app-region: drag;
}

.success-message__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    color: #030302;
}

.success-message :deep(.wt-button) {
    -webkit-app-region: no-drag;
}
</style>
