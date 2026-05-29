<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAutoResize } from '../composables/useAutoResize';
import {
	type ProcessingPayload,
	sendReporting,
	setProcessingProperty,
} from '../composables/useCallIPC';
import ProgressTimer from './ProgressTimer.vue';
import SchedulePicker from './SchedulePicker.vue';

const props = defineProps<{
	payload: ProcessingPayload | null;
}>();
const { t } = useI18n();

const root = ref<HTMLDivElement | null>(null);
const scheduleAt = ref<number | undefined>();

const isSuccess = computed(() => !!props.payload?.reporting.isSuccess);
const isScheduleCall = computed(
	() => !!props.payload?.reporting.isScheduleCall,
);
const memberId = computed(() => props.payload?.memberId);

const containerWidth = computed(() =>
	memberId.value && !isSuccess.value && isScheduleCall.value ? 348 : 260,
);

useAutoResize(root, containerWidth);

watch(
	() => props.payload?.reporting.nextDistributeAt,
	(v) => {
		if (v) scheduleAt.value = v;
	},
	{
		immediate: true,
	},
);

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

function choiceYes() {
	setProcessingProperty({
		prop: 'isScheduleCall',
		value: true,
	});
}

function choiceNo() {
	setProcessingProperty({
		prop: 'isScheduleCall',
		value: false,
	});
}

function save() {
	sendReporting();
}
</script>

<template>
	<div
		v-if="payload"
		id="mainProcessing"
		ref="root"
		class="main-processing"
	>
		<ProgressTimer :payload="payload" />
		<span
			class="title"
			:style="{ marginTop: isSuccess ? '30px' : '10px' }"
		>
			{{ isSuccess ? t('callSuccessfulText') : memberId ? t('scheduleCallText') : '' }}
		</span>

		<div
			v-if="isSuccess"
			class="processing-controls"
		>
			<button
				id="successBtn"
				class="control-button"
				type="button"
				@click="onSuccess"
			>
				{{ t('Yes') }}
			</button>
			<button
				id="failBtn"
				class="control-button"
				type="button"
				@click="onFail"
			>
				{{ t('No') }}
			</button>
		</div>

		<div
			v-else-if="memberId"
			id="failControls"
			style="min-width:260px"
		>
			<div style="text-align: center; margin-top: 20px;">
				<input
					id="choiceYes"
					type="radio"
					class="control-button"
					name="choice"
					value="Yes"
					:checked="isScheduleCall"
					@click="choiceYes"
				/>
				<label
					for="choiceYes"
					style="padding-left: 13px;"
				>
					{{ t('Yes') }}
				</label>

				<input
					id="choiceNo"
					type="radio"
					class="control-button"
					name="choice"
					value="No"
					style="margin-left: 33px;"
					:checked="!isScheduleCall"
					@click="choiceNo"
				/>
				<label
					for="choiceNo"
					style="padding-left: 13px;"
				>
					{{ t('No') }}
				</label>
			</div>
			<SchedulePicker
				v-if="isScheduleCall"
				v-model="scheduleAt"
			/>
			<div style="text-align: center;">
				<button
					id="saveBtn"
					class="buttons"
					type="button"
					@click="save"
				>
					{{ t('Save') }}
				</button>
			</div>
		</div>
	</div>
</template>
