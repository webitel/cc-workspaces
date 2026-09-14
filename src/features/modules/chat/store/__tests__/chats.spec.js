import WorkspaceStates from '../../../../../ui/enums/WorkspaceState.enum';
import ChatTransferDestination from '../../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import chatModule from '../chat';

const chatOnWorkspace = {
	id: '1',
	messages: [
		{
			text: 'Hello',
		},
	],
	join: vi.fn(),
	decline: vi.fn(),
	leave: vi.fn(),
	send: vi.fn(),
	sendText: vi.fn(),
	transferToUser: vi.fn(),
	transferToPlan: vi.fn(),
};

describe('features/chat store: actions', () => {
	const context = {
		state: {
			chatsList: [],
		},
		getters: {
			CHAT_ON_WORKSPACE: chatOnWorkspace,
			closed: {
				ALL_CLOSED_CHATS: [],
			},
		},
		rootGetters: {
			'features/chat/closed/ALL_CLOSED_CHATS': [],
		},
		dispatch: vi.fn(),
		commit: vi.fn(),
	};

	beforeEach(() => {
		context.getters = {
			CHAT_ON_WORKSPACE: chatOnWorkspace,
			closed: {
				ALL_CLOSED_CHATS: [],
			},
		};
		chatOnWorkspace.join.mockClear();
		chatOnWorkspace.leave.mockClear();
		chatOnWorkspace.decline.mockClear();
		chatOnWorkspace.transferToUser.mockClear();
		chatOnWorkspace.transferToPlan.mockClear();
		context.dispatch.mockClear();
		context.commit.mockClear();
	});

	it('ACCEPT action calls chat join() method', () => {
		chatModule.actions.ACCEPT(context);
		expect(chatOnWorkspace.join).toHaveBeenCalled();
	});

	it('ACCEPT action calls chat join() method', () => {
		chatModule.actions.ACCEPT(context);
		expect(chatOnWorkspace.join).toHaveBeenCalled();
	});

	it('SEND action calls chat send() method', () => {
		const message = 'jest';
		chatModule.actions.SEND(context, message);
		expect(chatOnWorkspace.send).toHaveBeenCalledWith(message);
	});

	it('SEND_FILE action dispatches SEND_SINGLE_FILE, if 1 file is passed', () => {
		const file = {
			name: 'jest1',
		};
		chatModule.actions.SEND_FILE(context, file);
		expect(context.dispatch).toHaveBeenCalledWith('SEND_SINGLE_FILE', file);
	});

	it('SEND_FILE action dispatches SEND_SINGLE_FILE for each passed file in array', () => {
		const files = [
			{
				name: 'jest1',
			},
			{
				name: 'jest2',
			},
		];
		chatModule.actions.SEND_FILE(context, files);
		expect(context.dispatch).toHaveBeenCalledTimes(files.length);
		expect(context.dispatch.mock.calls[0]).toEqual([
			'SEND_SINGLE_FILE',
			files[0],
		]);
		expect(context.dispatch.mock.calls[1]).toEqual([
			'SEND_SINGLE_FILE',
			files[1],
		]);
	});

	describe('SEND_SINGLE_FILE', () => {
		const file = {
			name: 'jest1',
		};

		it('dispatches SEND with the file and commits nothing when it succeeds', async () => {
			context.dispatch.mockResolvedValueOnce(undefined);
			await chatModule.actions.SEND_SINGLE_FILE(context, file);
			expect(context.dispatch).toHaveBeenCalledWith('SEND', file);
			expect(context.commit).not.toHaveBeenCalled();
		});

		it('re-throws a transformed error and does not add a failed-file entry for a malware rejection', async () => {
			const err = {
				response: {
					data: {
						id: 'file.malware',
					},
				},
			};
			context.dispatch.mockRejectedValueOnce(err);
			await expect(
				chatModule.actions.SEND_SINGLE_FILE(context, file),
			).rejects.toEqual(err);
			expect(context.commit).not.toHaveBeenCalled();
		});

		it('re-throws a transformed error and does not add a failed-file entry for a non-malware, non-dimensions rejection', async () => {
			const err = {
				response: {
					data: {
						id: 'file.storage_limit_exceeded',
					},
				},
			};
			context.dispatch.mockRejectedValueOnce(err);
			await expect(
				chatModule.actions.SEND_SINGLE_FILE(context, file),
			).rejects.toEqual(err);
			expect(context.commit).not.toHaveBeenCalled();
		});

		it('re-throws a transformed error for a rejection with no response payload at all', async () => {
			const err = new Error('network error');
			context.dispatch.mockRejectedValueOnce(err);
			await expect(
				chatModule.actions.SEND_SINGLE_FILE(context, file),
			).rejects.toEqual(err);
			expect(context.commit).not.toHaveBeenCalled();
		});

		it('commits ADD_FAILED_FILE (and does not throw) for a send_file_chat websocket-RPC rejection carrying PHOTO_INVALID_DIMENSIONS (raw message.error shape, no response wrapper)', async () => {
			const err = {
				code: 500,
				id: 'go.micro.client',
				status: 'Internal Server Error',
				detail: 'Bad Request: PHOTO_INVALID_DIMENSIONS',
			};
			context.dispatch.mockRejectedValueOnce(err);
			await chatModule.actions.SEND_SINGLE_FILE(context, file);
			expect(context.commit).toHaveBeenCalledWith('ADD_FAILED_FILE', {
				key: chatOnWorkspace.id,
				id: expect.any(String),
				file,
				createdAt: expect.any(Number),
			});
		});

		it('also detects PHOTO_INVALID_DIMENSIONS via the axios response.data shape as a fallback', async () => {
			const err = {
				response: {
					data: {
						detail: 'Bad Request: PHOTO_INVALID_DIMENSIONS',
					},
				},
			};
			context.dispatch.mockRejectedValueOnce(err);
			await chatModule.actions.SEND_SINGLE_FILE(context, file);
			expect(context.commit).toHaveBeenCalledWith('ADD_FAILED_FILE', {
				key: chatOnWorkspace.id,
				id: expect.any(String),
				file,
				createdAt: expect.any(Number),
			});
		});

		it('anchors createdAt after the last real chat message so it cannot sort before it under client/server clock skew', async () => {
			const err = {
				detail: 'Bad Request: PHOTO_INVALID_DIMENSIONS',
			};
			context.dispatch.mockRejectedValueOnce(err);
			context.getters = {
				...context.getters,
				CHAT_ON_WORKSPACE: {
					...chatOnWorkspace,
					messages: [
						{
							text: 'Hello',
							createdAt: 5000,
						},
						{
							text: 'broken picture',
							createdAt: 9999999999999,
						},
					],
				},
			};
			await chatModule.actions.SEND_SINGLE_FILE(context, file);
			expect(context.commit).toHaveBeenCalledWith('ADD_FAILED_FILE', {
				key: chatOnWorkspace.id,
				id: expect.any(String),
				file,
				createdAt: 10000000000000,
			});
		});
	});

	it('TRANSFER action calls chat transferToUser() method is passed destination is USER', () => {
		const id = 'jest';
		const payload = {
			destination: ChatTransferDestination.USER,
			item: {
				id,
			},
		};
		chatModule.actions.TRANSFER(context, payload);
		expect(chatOnWorkspace.transferToUser).toHaveBeenCalledWith(id);
	});

	it('TRANSFER action calls chat transferToPlan() method is passed destination is CHATPLAN', () => {
		const id = 'jest';
		const payload = {
			destination: ChatTransferDestination.CHATPLAN,
			item: {
				id,
			},
		};
		chatModule.actions.TRANSFER(context, payload);
		expect(chatOnWorkspace.transferToPlan).toHaveBeenCalledWith(id);
	});

	it('CLOSE action calls chat leave() method, if allowLeave is true', () => {
		chatOnWorkspace.allowLeave = true;
		chatModule.actions.CLOSE(context);
		expect(chatOnWorkspace.leave).toHaveBeenCalled();
	});

	it('CLOSE action calls chat decline() method', () => {
		chatOnWorkspace.allowLeave = false;
		chatModule.actions.CLOSE(context);
		expect(chatOnWorkspace.decline).toHaveBeenCalled();
	});

	it('CLOSE action clears the failed-file entries for that chat', async () => {
		await chatModule.actions.CLOSE(context);
		expect(context.dispatch).toHaveBeenCalledWith(
			'CLEAR_FAILED_FILES',
			chatOnWorkspace.id,
		);
	});

	it('CLEAR_FAILED_FILES action commits SET_FAILED_FILES with an empty bucket for that key', () => {
		chatModule.actions.CLEAR_FAILED_FILES(context, '1');
		expect(context.commit).toHaveBeenCalledWith('SET_FAILED_FILES', {
			key: '1',
			files: [],
		});
	});

	it('OPEN_CHAT dispatches SET_WORKSPACE for active chat without contact', () => {
		chatModule.actions.OPEN_CHAT(context, chatOnWorkspace);
		expect(context.dispatch).toHaveBeenCalledWith(
			'SET_WORKSPACE',
			chatOnWorkspace,
		);
	});

	it('OPEN_CHAT dispatches LOAD_CLOSED_CHAT for closed chat without contact', () => {
		const closedChat = {
			...chatOnWorkspace,
			closedAt: Date.now(),
		};
		chatModule.actions.OPEN_CHAT(context, closedChat);
		expect(context.dispatch).toHaveBeenCalledWith(
			'features/chat/closed/LOAD_CLOSED_CHAT',
			closedChat,
			{
				root: true,
			},
		);
	});

	it('OPEN_CHAT dispatches SET_WORKSPACE when contact is identified', () => {
		const chatWithContact = {
			...chatOnWorkspace,
			contact: {
				id: 'contact-1',
			},
		};
		chatModule.actions.OPEN_CHAT(context, chatWithContact);
		expect(context.dispatch).toHaveBeenCalledWith(
			'SET_WORKSPACE',
			chatWithContact,
		);
	});

	it('SET_WORKSPACE dispatches global SET_WORKSPACE_STATE action', () => {
		chatModule.actions.SET_WORKSPACE(context, chatOnWorkspace);
		expect(context.dispatch).toHaveBeenCalledWith(
			'workspace/SET_WORKSPACE_STATE',
			{
				type: WorkspaceStates.CHAT,
				task: chatOnWorkspace,
			},
			{
				root: true,
			},
		);
	});

	it('RESET_WORKSPACE dispatches global SET_WORKSPACE_STATE action', () => {
		chatModule.actions.RESET_WORKSPACE(context);
		expect(context.dispatch).toHaveBeenCalledWith(
			'workspace/RESET_WORKSPACE_STATE',
			null,
			{
				root: true,
			},
		);
	});

	it('HANDLE_CHAT_EVENT action dispatches global HANDLE_CHAT_EVENT action with action and chat params', () => {
		const action = 'message';
		chatModule.actions.HANDLE_CHAT_EVENT(context, {
			action,
			chat: chatOnWorkspace,
		});
		expect(context.dispatch).toHaveBeenCalledWith(
			'features/chatNotifications/HANDLE_CHAT_EVENT',
			{
				action,
				chat: chatOnWorkspace,
			},
			{
				root: true,
			},
		);
	});

	it('_RESET_UNREAD_COUNT action dispatches global _RESET_UNREAD_COUNT action', () => {
		chatModule.actions._RESET_UNREAD_COUNT(context);
		expect(context.dispatch).toHaveBeenCalledWith(
			'features/notifications/_RESET_UNREAD_COUNT',
			null,
			{
				root: true,
			},
		);
	});
});

describe('features/chat store: getters', () => {
	it('FAILED_FILES returns the failed-file entries for the current chat', () => {
		const entries = [
			{
				id: 'a',
				photoInvalidDimensions: true,
				file: {},
			},
		];
		const state = {
			failedFiles: {
				[chatOnWorkspace.id]: entries,
			},
		};
		const getters = {
			CHAT_ON_WORKSPACE: chatOnWorkspace,
		};
		expect(chatModule.getters.FAILED_FILES(state, getters)).toEqual(entries);
	});

	it('FAILED_FILES returns an empty array when there is nothing failed for the current chat', () => {
		const state = {
			failedFiles: {},
		};
		const getters = {
			CHAT_ON_WORKSPACE: chatOnWorkspace,
		};
		expect(chatModule.getters.FAILED_FILES(state, getters)).toEqual([]);
	});

	it("FAILED_FILES keys by conversationId over id (id changes during a chat's lifetime)", () => {
		const entries = [
			{
				id: 'b',
			},
		];
		const state = {
			failedFiles: {
				'conversation-1': entries,
			},
		};
		const getters = {
			CHAT_ON_WORKSPACE: {
				...chatOnWorkspace,
				conversationId: 'conversation-1',
				id: 'channel-9',
			},
		};
		expect(chatModule.getters.FAILED_FILES(state, getters)).toEqual(entries);
	});
});

describe('features/chat store: mutations', () => {
	it('SET_MEDIA_VIEW sets passed message to mediaView state prop', () => {
		const message = {
			id: '1',
		};
		const mediaView = message;
		const state = {
			mediaView: {},
		};
		chatModule.mutations.SET_MEDIA_VIEW(state, message);
		expect(state.mediaView).toEqual(mediaView);
	});

	describe('ADD_FAILED_FILE', () => {
		it('creates the chat bucket and pushes a photoInvalidDimensions entry', () => {
			const state = {
				failedFiles: {},
			};
			const file = {
				name: 'jest1',
			};
			chatModule.mutations.ADD_FAILED_FILE(state, {
				key: '1',
				id: 'a',
				file,
				createdAt: 1735689600000,
			});
			expect(state.failedFiles['1']).toEqual([
				{
					id: 'a',
					photoInvalidDimensions: true,
					file,
					member: {
						self: true,
					},
					channelId: undefined,
					createdAt: 1735689600000,
				},
			]);
		});

		it('appends to an existing chat bucket without dropping earlier entries', () => {
			const existing = {
				id: 'a',
				photoInvalidDimensions: true,
				file: {},
				createdAt: 1735689600000,
			};
			const state = {
				failedFiles: {
					1: [
						existing,
					],
				},
			};
			chatModule.mutations.ADD_FAILED_FILE(state, {
				key: '1',
				id: 'b',
				file: {},
			});
			expect(state.failedFiles['1']).toHaveLength(2);
			expect(state.failedFiles['1'][0]).toEqual(existing);
			expect(state.failedFiles['1'][1].id).toBe('b');
		});
	});

	describe('SET_FAILED_FILES', () => {
		it('sets the bucket for that key', () => {
			const state = {
				failedFiles: {
					1: [
						{
							id: 'a',
						},
					],
					2: [
						{
							id: 'b',
						},
					],
				},
			};
			chatModule.mutations.SET_FAILED_FILES(state, {
				key: '1',
				files: [],
			});
			expect(state.failedFiles).toEqual({
				1: [],
				2: [
					{
						id: 'b',
					},
				],
			});
		});
	});
});
