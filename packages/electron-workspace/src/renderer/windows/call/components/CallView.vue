<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import iconActiveCall from '@img/active-call.svg';
import iconHoldCall from '@img/hold-call.svg';
import iconRingingCall from '@img/ringing-call.svg';
import iconCollaps from '@img/icon-collaps-md.svg';
import iconArrowDown from '@img/icon-arrow-down--md.svg';
import iconArrowUp from '@img/icon-arrow-up--md.svg';
import iconMicDefault from '@img/mic-default-bttn.svg';
import iconMicOffPressed from '@img/mic-off-pressed-bttn.svg';
import iconHoldDefault from '@img/hold-default-bttn.svg';
import iconHoldPressed from '@img/hold-pressed-bttn.svg';
import iconDeclineDefault from '@img/decline-default-bttn.svg';
import { useAutoResize } from '../composables/useAutoResize';
import { useCallTimer } from '../composables/useCallTimer';
import {
	type CallPayload,
	collapseWindow,
	sendCallAction,
} from '../composables/useCallIPC';

const props = defineProps<{
	call: CallPayload | null;
}>();
const { t } = useI18n();
const md = new MarkdownIt();
const root = ref<HTMLDivElement | null>(null);
const showAdditionalInfo = ref(false);
const { min, sec, reset, startWithDate, startWithDuration } = useCallTimer();

// useAutoResize(root, 279);

const callName = computed(() => props.call?.displayName || '');
const callNumber = computed(() =>
	props.call?.showNumber ? props.call?.displayNumber || '' : '',
);
const queueName = computed(() => props.call?.queueName || '');

const variablesHtml = computed(() => {
	const vars = props.call?.variables;
	if (!vars || typeof vars !== 'object') return '';
	let html = '';
	for (let [key, value] of Object.entries(vars)) {
		if (isValidHttpUrl(String(value))) value = `<${value}>`;
		html += `<p><span style="font-weight:600">${md.renderInline(
			key,
		)}</span>${md.renderInline(`: ${value}`)}</p>`;
	}
	return html;
});

const holdIconUrl = computed(() => {
	if (!props.call || !props.call.answered) return iconRingingCall;
	return props.call.isHold ? iconHoldCall : iconActiveCall;
});

function isValidHttpUrl(s: string) {
	try {
		const u = new URL(s);
		return u.protocol === 'http:' || u.protocol === 'https:';
	} catch {
		return false;
	}
}

function toggleInfo() {
	showAdditionalInfo.value = !showAdditionalInfo.value;
}

watch(
	() => props.call,
	(call) => {
		if (!call) {
			reset();
			return;
		}
		if (call.action === 'features/call/TOGGLE_MUTE') return;
		if (call.answered && call.answeredAt) startWithDate(call.answeredAt);
		else if (!call.answered) startWithDuration(call.duration ?? 0);
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div
		v-if="call"
		id="mainCall"
		ref="root"
		class="main"
	>
		<div class="head" style="display: inline-flex;">
			<div class="header-info">
				<div
					class="img-active-hold"
					:style="{ backgroundImage: `url('${holdIconUrl}')` }"
				></div>
				<div class="contact-info">
					<span class="call-name">{{ callName }}</span>
					<span class="call-number">{{ callNumber }}</span>
				</div>
				<div class="call-time">
					<span>{{ min }}</span>:<span>{{ sec }}</span>
				</div>
				<div>
					<input
						id="collapsBtn"
						class="buttons"
						type="image"
						:src="iconCollaps"
						name="collapsBtn"
						alt="collaps"
						@click="collapseWindow"
					/>
				</div>
			</div>

			<div
				v-if="queueName"
				id="queue"
				class="queue"
			>
				<span id="queueName">{{ queueName }}</span>
			</div>

			<div
				v-if="showAdditionalInfo"
				id="infoOpen"
				class="additional-info-open"
			>
				<div
					class="text-info"
					v-html="variablesHtml"
				></div>
				<div class="up-Arrow-button">
					<input
						id="upArrowBtn"
						class="arrow-button"
						type="image"
						:src="iconArrowUp"
						name="upArrowBtn"
						alt="up"
						@click="toggleInfo"
					/>
				</div>
			</div>

			<div
				v-else
				id="infoClose"
				class="additional-info-close"
				:style="{
					margin: call.answered ? '16.5px 0 16.5px 0' : '10px 0 10px 0',
				}"
			>
				<div class="center-border"></div>
				<div class="down-Arrow-button">
					<input
						id="downArrowBtn"
						class="arrow-button"
						type="image"
						:src="iconArrowDown"
						name="downArrowBtn"
						alt="down"
						@click="toggleInfo"
					/>
				</div>
				<div class="center-border"></div>
			</div>

			<div class="controls">
				<div
					v-if="call.answered"
					class="answered-call-controls"
				>
					<input
						v-show="!call.muted"
						id="muteBtn"
						class="control-button"
						type="image"
						:src="iconMicDefault"
						name="muteBtn"
						alt="mic"
						@click="sendCallAction('mute')"
					/>
					<input
						v-show="call.muted"
						id="mutePressedBtn"
						class="control-button"
						type="image"
						:src="iconMicOffPressed"
						name="mutePressedBtn"
						alt="mic-off"
						@click="sendCallAction('mute')"
					/>
					<input
						v-show="!call.isHold"
						id="holdBtn"
						class="control-button"
						type="image"
						:src="iconHoldDefault"
						name="holdBtn"
						alt="hold"
						@click="sendCallAction('hold')"
					/>
					<input
						v-show="call.isHold"
						id="holdPressedBtn"
						class="control-button"
						type="image"
						:src="iconHoldPressed"
						name="holdPressedBtn"
						alt="hold-on"
						@click="sendCallAction('hold')"
					/>
					<input
						id="declineBtn"
						class="control-button"
						type="image"
						:src="iconDeclineDefault"
						name="declineBtn"
						alt="decline"
						@click="sendCallAction('reject')"
					/>
				</div>
				<div
					v-else
					class="new-call-controls"
				>
					<button
						v-if="call.allowAnswer"
						id="answerBtn"
						class="control-button"
						type="button"
						@click="sendCallAction('answer')"
					>
						{{ t('Answer') }}
					</button>
					<button
						id="rejectBtn"
						class="control-button"
						type="button"
						:style="{ marginLeft: call.allowAnswer ? '0' : '98px' }"
						@click="sendCallAction('reject')"
					>
						{{ t('Reject') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.main {
	width: max-content;
	height: max-content;
	background: #f7f7f7;
	-webkit-app-region: drag;
	border-radius: 5px;
}
.call-name {
	margin-bottom: 5px;
	font-size: 14px;
	line-height: 18px;
}
.call-name,
.call-time,
#queueName {
	font-family: Montserrat;
	font-style: normal;
	font-weight: 600;
	align-items: center;
	display: flex;
}
.call-name,
.call-number,
.down-Arrow-button,
.up-Arrow-button,
.text-info {
	-webkit-app-region: no-drag;
}
.call-number {
	font-family: Montserrat;
	font-weight: normal;
	font-size: 12px;
	line-height: 14px;
	display: flex;
	align-items: center;
	color: #808080;
}
.new-call-controls,
.answered-call-controls {
	width: 100%;
	display: flex;
}
.center-border {
	margin: 12px 10px 0;
	width: 108.5px;
	border-top: 1px solid #e0e7eb;
}
.up-Arrow-button {
	margin-left: 118.5px;
	height: 24px;
	width: 24px;
	padding-bottom: 15px;
}
.contact-info {
	width: 153px;
	overflow-wrap: anywhere;
	margin: 10px 0 0 10px;
}
.header-info,
.additional-info-close {
	display: flex;
}
.additional-info-close {
	margin: 10px 0;
	height: 24px;
}
.additional-info-open {
	box-shadow:
		inset 1px 1px 1px rgba(0, 0, 0, 0.05),
		inset -1px -1px 1px #ffffff,
		inset 0 0 8px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	margin: 10px;
	width: 261px;
}
.text-info {
	font-family: Montserrat;
	font-weight: normal;
	font-size: 14px;
	line-height: 18px;
	word-break: break-word;
	color: #030302;
	width: 231px;
	padding: 10px 15px;
}
.call-time {
	margin: 10px 0 0 10px;
	font-size: 12px;
	line-height: 14px;
	text-align: right;
	color: #000;
	width: 30px;
	height: 14px;
	right: 40px;
	top: 10px;
}
.img-active-hold {
	width: 24px;
	height: 24px;
	margin: 10px 0 0 10px;
	background-size: contain;
	background-repeat: no-repeat;
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
input[id="collapsBtn"] {
	opacity: 0.8;
	box-shadow: 0 0 10px rgb(0 0 0 / 10%);
	margin: 10px 0 0 10px;
}
.arrow-button {
	background: #f7f7f7;
	box-shadow:
		inset 1px 1px 2px rgba(255, 255, 255, 0.5),
		inset -1px -1px 2px rgba(0, 0, 0, 0.05);
	border-radius: 5px;
	border: none;
	outline: none;
}
input[id="downArrowBtn"]:hover {
	background-image: url("@img/icon-arrow-down-hover-md.svg");
}
input[id="upArrowBtn"]:hover {
	background-image: url("@img/icon-arrow-up-hover-md.svg");
}
input[id="collapsBtn"]:hover {
	background-image: url("@img/icon-collaps-hover-md.svg");
}
input[id="holdPressedBtn"]:hover {
	background-image: url("@img/hold-pressed-hover-bttn.svg");
}
input[id="mutePressedBtn"]:hover {
	background-image: url("@img/mic-off-pressed-hover-bttn.svg");
}
input[id="muteBtn"]:hover {
	background-image: url("@img/mic-hover-bttn.svg");
}
input[id="holdBtn"]:hover {
	background-image: url("@img/hold-hover-bttn.svg");
}
input[id="declineBtn"]:hover {
	background-image: url("@img/decline-hover-bttn.svg");
}
#rejectBtn:hover,
#answerBtn:hover {
	opacity: 1;
}
#answerBtn {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	margin: 0 10px 10px 48px;
	color: #f7f7f7;
	position: relative;
	width: 87px;
	height: 38px;
	border: none;
	background: #2ba329;
	opacity: 0.8;
	box-shadow:
		inset 1px 1px 1px rgba(0, 0, 0, 0.05),
		inset -1px -1px 1px rgba(255, 255, 255, 0.5),
		inset 0 0 1px 2px rgba(0, 0, 0, 0.05),
		inset 0 0 8px rgba(0, 0, 0, 0.1);
	border-radius: 20px;
}
#rejectBtn {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	color: #f7f7f7;
	width: 88px;
	height: 38px;
	background: #e63e1a;
	opacity: 0.8;
	box-shadow:
		inset 1px 1px 2px #ffffff,
		inset -2px -2px 2px rgba(0, 0, 0, 0.15);
	border-radius: 20px;
	margin: 0 48px 10px 0;
}
input[id="declineBtn"] {
	margin: 0 64.5px 10px 0;
}
input[id="holdBtn"],
input[id="holdPressedBtn"] {
	margin: 0 10px 10px 10px;
}
input[id="muteBtn"],
input[id="mutePressedBtn"] {
	margin: 0 0 10px 64.5px;
}
.queue {
	word-break: break-word;
	max-width: fit-content;
	margin: 10px 10px 0 10px;
	align-items: center;
	padding: 5px 10px;
	background: #e0e7eb;
	border-radius: 20px;
	width: fit-content;
}
#queueName {
	font-size: 10px;
	line-height: 12px;
	color: #030302;
}
</style>
