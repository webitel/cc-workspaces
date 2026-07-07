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

<style>
.main-processing {
	width: max-content;
	height: max-content;
	background: #f7f7f7;
	-webkit-app-region: drag;
	border-radius: 5px;
}
.title {
	margin-top: 30px;
	justify-content: center;
	font-family: Montserrat;
	font-style: normal;
	font-weight: 600;
	align-items: center;
	display: flex;
	font-size: 14px;
	line-height: 18px;
	color: #030302;
	mix-blend-mode: normal;
	-webkit-app-region: drag;
}
.processing-controls {
	-webkit-app-region: drag;
	text-align: center;
	height: 38px;
	width: 260px;
	margin: 30px 0;
}
.control-button {
	border-radius: 20px;
	border: none;
	outline: none;
	-webkit-app-region: no-drag;
}
.buttons {
	border: none;
	outline: none;
	border-radius: 5px;
	-webkit-app-region: no-drag;
}
#failBtn:hover,
#successBtn:hover,
#saveBtn:hover {
	opacity: 1;
}
#failBtn {
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	position: relative;
	width: 92px;
	height: 38px;
	color: #f7f7f7;
	border: none;
	background: #e63e1a;
	opacity: 0.8;
	box-shadow:
		inset 1px 1px 2px #ffffff,
		inset -2px -2px 2px rgba(0, 0, 0, 0.15);
	border-radius: 20px;
}
#successBtn {
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	position: relative;
	width: 92px;
	height: 38px;
	color: #f7f7f7;
	border: none;
	background: #2ba329;
	opacity: 0.8;
	box-shadow:
		inset 1px 1px 2px #ffffff,
		inset -2px -2px 2px rgba(0, 0, 0, 0.15);
	border-radius: 20px;
	margin-right: 15px;
}
#saveBtn {
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	width: 85px;
	height: 38px;
	background: #ffc000;
	opacity: 0.8;
	border-radius: 5px;
	color: #f7f7f7;
	border: none;
	margin: 20px 0 17px;
}
input[type="radio"],
label {
	cursor: pointer;
}
label {
	font-family: Montserrat;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 18px;
	color: #030302;
}
input[type="radio"] {
	position: relative;
	height: 12px;
	width: 13px;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	outline: none;
}
input[type="radio"]::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	border: 2px solid #00314d;
}
input[type="radio"]:checked::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: #00314d;
	transform: translate(-50%, -50%);
	visibility: visible;
}
</style>
