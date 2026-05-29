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

useAutoResize(root, 279);

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
