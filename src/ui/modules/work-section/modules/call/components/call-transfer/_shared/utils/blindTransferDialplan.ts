import type { Call } from 'webitel-sdk';

import { useWebSocketClient } from '../../../../../../../../../app/api/agent-workspace/websocket/useWebSocketClient';

const blindTransferDialplan = async (
	call: Call,
	schemaId: number,
): Promise<void> => {
	const { getClientSync } = useWebSocketClient();
	const client = getClientSync();

	await client.request('call_bt_dialplan', {
		id: call.id,
		schema_id: schemaId,
	});
};

export default blindTransferDialplan;
