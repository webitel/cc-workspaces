import WorkspaceStates from '../../../../../ui/enums/WorkspaceState.enum';
import ChatTransferDestination from '../../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import chatModule from '../chat';

const chatOnWorkspace = {
  id: '1',
  messages: [{ text: 'Hello' }],
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

  it('SEND_FILE action calls chat send() method, if 1 file is passed', () => {
    const file = { name: 'jest1' };
    chatModule.actions.SEND_FILE(context, file);
    expect(context.dispatch).toHaveBeenCalledWith('SEND', file);
  });

  it('SEND_FILE action calls chat send() method, for each passed file in array', () => {
    const files = [{ name: 'jest1' }, { name: 'jest2' }];
    chatModule.actions.SEND_FILE(context, files);
    expect(context.dispatch).toHaveBeenCalledTimes(files.length);
    expect(context.dispatch.mock.calls[0]).toEqual(['SEND', files[0]]);
    expect(context.dispatch.mock.calls[1]).toEqual(['SEND', files[1]]);
  });

  it('TRANSFER action calls chat transferToUser() method is passed destination is USER', () => {
    const id = 'jest';
    const payload = { destination: ChatTransferDestination.USER, item: { id } };
    chatModule.actions.TRANSFER(context, payload);
    expect(chatOnWorkspace.transferToUser).toHaveBeenCalledWith(id);
  });

  it('TRANSFER action calls chat transferToPlan() method is passed destination is CHATPLAN', () => {
    const id = 'jest';
    const payload = { destination: ChatTransferDestination.CHATPLAN, item: { id } };
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

  it('OPEN_CHAT dispatches SET_WORKSPACE action with passed chat as param', () => {
    chatModule.actions.OPEN_CHAT(context, chatOnWorkspace);
    expect(context.dispatch).toHaveBeenCalledWith('SET_WORKSPACE', chatOnWorkspace);
  });

  it('CHAT_INSERT_TO_START changes passed chat position to start in chatList array', () => {
    const oldChat = { id: '1' };
    const updatedChat = { id: '2' };
    const oldChatList = [oldChat, updatedChat];
    const updatedChatList = [updatedChat, oldChat];
    context.state.chatList = oldChatList;
    chatModule.actions.CHAT_INSERT_TO_START(context, updatedChat);
    expect(context.commit).toHaveBeenCalledWith('SET_CHAT_LIST', updatedChatList);
  });

  it('SET_WORKSPACE dispatches global SET_WORKSPACE_STATE action', () => {
    chatModule.actions.SET_WORKSPACE(context, chatOnWorkspace);
    expect(context.dispatch).toHaveBeenCalledWith('workspace/SET_WORKSPACE_STATE', { type: WorkspaceStates.CHAT, task: chatOnWorkspace }, { root: true });
  });

  it('RESET_WORKSPACE dispatches global SET_WORKSPACE_STATE action', () => {
    chatModule.actions.RESET_WORKSPACE(context);
    expect(context.dispatch).toHaveBeenCalledWith('workspace/RESET_WORKSPACE_STATE', null, { root: true });
  });

  it('HANDLE_CHAT_EVENT action dispatches global HANDLE_CHAT_EVENT action with action and chat params', () => {
    const action = 'message';
    chatModule.actions.HANDLE_CHAT_EVENT(context, { action, chat: chatOnWorkspace });
    expect(context.dispatch).toHaveBeenCalledWith('features/notifications/HANDLE_CHAT_EVENT', { action, chat: chatOnWorkspace }, { root: true });
  });

  it('_RESET_UNREAD_COUNT action dispatches global _RESET_UNREAD_COUNT action', () => {
    chatModule.actions._RESET_UNREAD_COUNT(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/notifications/_RESET_UNREAD_COUNT', null, { root: true });
  });

});

describe('features/chat store: mutations', () => {
  it('SET_CHAT_LIST sets chatList to state', () => {
    const chatList = [chatOnWorkspace];
    const state = { chatList: [] };
    chatModule.mutations.SET_CHAT_LIST(state, chatList);
    expect(state.chatList).toEqual(chatList);
  });

  it('ADD_CHAT pushes new chat to chatList', () => {
    const chatList = [chatOnWorkspace];
    const state = { chatList: [] };
    chatModule.mutations.ADD_CHAT(state, chatOnWorkspace);
    expect(state.chatList).toEqual(chatList);
  });

  it('REMOVE_CHAT removes existing chat from chatList', () => {
    const chatList = [];
    const state = { chatList: [chatOnWorkspace] };
    chatModule.mutations.REMOVE_CHAT(state, chatOnWorkspace);
    expect(state.chatList).toEqual(chatList);
  });

  it('SET_MEDIA_VIEW sets passed message to mediaView state prop', () => {
    const message = { id: '1' };
    const mediaView = message;
    const state = { mediaView: {} };
    chatModule.mutations.SET_MEDIA_VIEW(state, message);
    expect(state.mediaView).toEqual(mediaView);
  });
});
