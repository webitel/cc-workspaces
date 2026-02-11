import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { CallActions, CallDirection } from 'webitel-sdk';

import blackSonar from '../../app/assets/call-sonars/black-sonar.svg';
import greenSonar from '../../app/assets/call-sonars/green-sonar.svg';
import redSonar from '../../app/assets/call-sonars/red-sonar.svg';
import yellowSonar from '../../app/assets/call-sonars/yellow-sonar.svg';
import { useCallTimer } from './useCallTimer';

export const useCallState = () => {
	const store = useStore();
	const { t } = useI18n();

	const task = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

	const dtmf = computed(
		() => store.getters['features/call/GET_CURRENT_CALL_DIGITS'],
	);

	const { hangupTime, holdTime, startTime } = useCallTimer(task);

	const callState = computed(() => {
		switch (task.value.state) {
			case CallActions.Ringing:
				return t('workspaceSec.callState.ringing');
			case CallActions.Hold:
				return t('workspaceSec.callState.onHold');
			case CallActions.Active:
				return t('workspaceSec.callState.inCall');
			case CallActions.Hangup:
				return t('workspaceSec.callState.hangup');
			default:
				return task.value.state || '';
		}
	});

	const isRinging = computed(() => task.value.state === CallActions.Ringing);

	const isCallActive = computed(() => task.value.state === CallActions.Active);

	const isCallOnHold = computed(() => task.value.isHold);

	const isCallHangup = computed(() => task.value.state === CallActions.Hangup);

	const isCallInbound = computed(
		() => task.value.direction === CallDirection.Inbound,
	);

	const showTimer = computed(
		() =>
			isRinging.value ||
			isCallActive.value ||
			isCallOnHold.value ||
			isCallHangup.value,
	);

	const displayTime = computed(() => {
		if (isCallHangup.value) return hangupTime.value;
		if (task.value.isHold) return holdTime.value;
		return startTime.value;
	});

	const sonarIcon = computed(() => {
		if (isCallHangup.value) return redSonar;
		if (isCallOnHold.value) return yellowSonar;
		if (isRinging.value) {
			if (isCallInbound.value) return redSonar;
			return blackSonar;
		}
		if (isCallActive.value) return greenSonar;
		return '';
	});

	return {
		task,
		dtmf,
		callState,
		isRinging,
		isCallActive,
		isCallOnHold,
		isCallHangup,
		isCallInbound,
		showTimer,
		displayTime,
		sonarIcon,
	};
};
