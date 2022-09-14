import { CallActions, ChatActions } from 'webitel-sdk';

export default class MockSocket {
  constructor(payload = {}) {
    this.call = payload.call || {};
    this.chat = payload.chat || {};
  }

  agent = {
    offlineMembers: () => ({ items: [{ name: 'member1' }, { name: 'member2' }] }),
  };

  agentSession = () => this.agent;

  allCall = () => [];

  allConversations = () => [];

  ringing = (call = this.call) => {
    const action = CallActions.Ringing;
    this.callCallback(action, call);
  };

  active = (call = this.call) => {
    const action = CallActions.Active;
    this.callCallback(action, call);
  };

  hangup = (call = this.call) => {
    const action = CallActions.Hangup;
    // eslint-disable-next-line no-param-reassign
    call.state = CallActions.Hangup;
    this.callCallback(action, call);
  };

  destroyCall = (call = this.call) => {
    const action = CallActions.Destroy;
    this.callCallback(action, call);
  };

  invite = (chat = this.chat) => {
    const action = ChatActions.UserInvite;
    this.chatCallback(action, chat);
  };

  message = (chat = this.chat) => {
    const action = ChatActions.Message;
    this.chatCallback(action, chat);
  };

  leave = (chat = this.chat) => {
    const action = ChatActions.Leave;
    this.chatCallback(action, chat);
  };

  decline = (chat = this.chat) => {
    const action = ChatActions.Decline;
    this.chatCallback(action, chat);
  };

  close = (chat = this.chat) => {
    const action = ChatActions.Close;
    this.chatCallback(action, chat);
  };

  destroy = (chat = this.chat) => {
    const action = ChatActions.Destroy;
    this.chatCallback(action, chat);
  };

  changeAgentStatus = (status = 'online', agent = this.agent) => {
    this.agentStatusCallback(status, agent);
  };

  subscribeCall = (callback) => {
    this.callCallback = callback;
  };

  subscribeChat = (callback) => {
    this.chatCallback = callback;
  };

  subscribeAgentsStatus = (callback) => {
    this.agentStatusCallback = callback;
  };

  subscribeUsersStatus = (callback) => {
    this.userStatusCallback = callback;
  };

  on = (eventName, callback) => {
    callback(eventName);
    return {
      trigger() {
        callback(eventName);
        return this;
      },
    };
  };
}
