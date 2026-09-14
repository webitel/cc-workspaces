<template>
  <wt-cc-agent-status-select
    class="agent-status-select"
    show-call-center-switcher
    :is-call-center-on="isCcenterOn"
    :agent-id="agent.agentId"
    :status="agent.status"
    :status-duration="statusDuration"
    :disabled="isControlsDisabled"
    @changed-call-center-mode="emit('changed-call-center-mode', $event)"
  ></wt-cc-agent-status-select>
</template>

<script setup lang="ts">
import WtCcAgentStatusSelect from '@webitel/ui-sdk/src/modules/AgentStatusSelect/components/wt-cc-agent-status-select.vue';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import type { LookupOption } from '@webitel/ui-sdk/src/types';
import { computed } from 'vue';
import { useStore } from 'vuex';

import { useWebSocketClient } from '../../../../app/api/agent-workspace/websocket/useWebSocketClient';
import { WebSocketConnectionState } from '../../../../ui/enums/WebSocketConnectionState.enum';

const emit = defineEmits<{
	'changed-call-center-mode': [
		payload?: LookupOption,
	];
}>();

const store = useStore();
const { state: websocketState } = useWebSocketClient();

const now = computed(() => store.state.ui.now.now);
const agent = computed(() => store.state.features.status.agent);
const isCcenterOn = computed(
	() => store.getters['features/status/IS_CCENTER_ON'],
);
const agentRemoved = computed(
	() => store.getters['features/status/AGENT_REMOVED'],
);

const statusDuration = computed<string>(() => {
	let time = now.value - (agent.value.lastStatusChange || Date.now());
	time = time < 0 ? 0 : time;
	return convertDuration(time / 1000);
});

const isControlsDisabled = computed<boolean>(
	() =>
		agentRemoved.value ||
		websocketState.value !== WebSocketConnectionState.Connected,
);
</script>
