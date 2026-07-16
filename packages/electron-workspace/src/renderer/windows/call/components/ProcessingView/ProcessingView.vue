<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAutoResize } from '../../composables/useAutoResize';
import {
	type ProcessingPayload,
	sendReporting,
	setProcessingProperty,
} from '../../composables/useCallIPC';
import ProcessingReport from './ProcessingReport/ProcessingReport.vue';
import ProcessingSchedule from './ProcessingSchedule/ProcessingSchedule.vue';
import ProgressTimer from './ProgressTimer/ProgressTimer.vue';

const props = defineProps<{
	payload: ProcessingPayload | null;
}>();

const root = ref<HTMLDivElement | null>(null);

const isSuccess = computed(() => !!props.payload?.reporting.isSuccess);
const isScheduleCall = computed(
	() => !!props.payload?.reporting.isScheduleCall,
);
const memberId = computed(() => props.payload?.memberId);

const containerWidth = computed(() =>
	memberId.value && !isSuccess.value && isScheduleCall.value ? 348 : 260,
);

useAutoResize(root, containerWidth);

function onSuccess() {
	sendReporting();
}

function onFail() {
	setProcessingProperty({
		prop: 'success',
		value: false,
	});
	if (!memberId.value) sendReporting();
}

function onChoice(value: boolean) {
	setProcessingProperty({
		prop: 'isScheduleCall',
		value,
	});
}

function save() {
	sendReporting();
}
</script>

<template>
    <div
        v-if="payload"
        ref="root"
        class="main-processing"
    >
        <ProgressTimer :payload="payload" />

        <ProcessingReport
            v-if="isSuccess"
            @success="onSuccess"
            @fail="onFail"
        />

        <ProcessingSchedule
            v-else-if="memberId"
            :is-schedule-call="isScheduleCall"
            :next-distribute-at="payload.reporting.nextDistributeAt"
            @choice="onChoice"
            @save="save"
        />
    </div>
</template>

<style scoped>
.main-processing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: max-content;
    height: max-content;
    padding: 0 0 20px;
    background: #f7f7f7;
    border-radius: 5px;
    -webkit-app-region: drag;
}
</style>
