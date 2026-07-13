import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';

import getUserStatusByPriority from '../getUserStatusByPriority';

describe('getUserStatusByPriority', () => {
	it('returns DND for dnd presence regardless of agent status', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip,dnd',
				},
				agentStatus: 'online',
			}),
		).toBe(AbstractUserStatus.DND);
	});

	it('returns BUSY for dlg presence (in call) even with agent OFFLINE', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip,dlg',
				},
				agentStatus: 'offline',
			}),
		).toBe(AbstractUserStatus.BUSY);
	});

	it('returns ACTIVE for non-agent with sip presence', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip',
				},
			}),
		).toBe(AbstractUserStatus.ACTIVE);
	});

	it('returns ACTIVE for non-agent with web presence', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'web',
				},
			}),
		).toBe(AbstractUserStatus.ACTIVE);
	});

	it('returns OFFLINE for non-agent without sip/web presence', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: '',
				},
			}),
		).toBe(AbstractUserStatus.OFFLINE);
		expect(getUserStatusByPriority({})).toBe(AbstractUserStatus.OFFLINE);
	});

	it('returns ONLINE for agent ONLINE', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip',
				},
				agentStatus: 'online',
			}),
		).toBe(AbstractUserStatus.ONLINE);
	});

	it('returns PAUSE for agent PAUSE', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip',
				},
				agentStatus: 'pause',
			}),
		).toBe(AbstractUserStatus.PAUSE);
	});

	it('returns PAUSE for agent BREAK_OUT', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip',
				},
				agentStatus: 'break_out',
			}),
		).toBe(AbstractUserStatus.PAUSE);
	});

	it('returns OFFLINE for agent OFFLINE regardless of sip/web presence', () => {
		expect(
			getUserStatusByPriority({
				presence: {
					status: 'sip,web',
				},
				agentStatus: 'offline',
			}),
		).toBe(AbstractUserStatus.OFFLINE);
	});
});
