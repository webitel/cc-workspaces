import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import AgentStatus from '@webitel/ui-sdk/src/enums/AgentStatus/AgentStatus.enum';

import parseUserStatus from './parseUserStatus';
import UserStatus from './UserStatus';

interface GetUserStatusByPriorityParams {
	presence?: {
		// because users without agent permissions can use workspase too
		status?: string | string[];
	} | null;
	agentStatus?: string | null;
}

// NOTE: this computed is needed to return user status by priority because user can have several statuses. See this task https://my.webitel.com/browse/WTEL-3798
export const getUserStatusByPriority = ({
	presence,
	agentStatus,
}: GetUserStatusByPriorityParams) => {
	const statusMap = parseUserStatus(presence);

	if (statusMap[UserStatus.DND]) return AbstractUserStatus.DND;
	if (statusMap[UserStatus.BUSY]) return AbstractUserStatus.BUSY;

	if (!agentStatus) {
		// user without agent permissions: green only if SIP/WEB registered
		return statusMap[UserStatus.SIP] || statusMap[UserStatus.WEB]
			? AbstractUserStatus.ACTIVE
			: AbstractUserStatus.OFFLINE;
	}

	if (agentStatus === AgentStatus.ONLINE) return AbstractUserStatus.ONLINE;
	if (
		agentStatus === AgentStatus.PAUSE ||
		agentStatus === AgentStatus.BREAK_OUT
	)
		return AbstractUserStatus.PAUSE;

	// agent OFFLINE — gray regardless of SIP/WEB presence
	return AbstractUserStatus.OFFLINE;
};
