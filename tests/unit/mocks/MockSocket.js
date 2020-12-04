import { CallActions } from 'webitel-sdk';

export default class MockSocket {
  constructor(call) {
    this.call = call;
  }

  agent = {
    offlineMembers: () => ({ items: [{ name: 'member1' }, { name: 'member2' }] }),
  };

  agentSession = () => this.agent;

  allCall = () => [];

  ringing = (call = this.call) => {
    const action = CallActions.Ringing;
    this.callback(action, call);
  };

  active = (call = this.call) => {
    const action = CallActions.Active;
    this.callback(action, call);
  };

  hangup = (call = this.call) => {
    const action = CallActions.Hangup;
    // eslint-disable-next-line no-param-reassign
    call.state = CallActions.Hangup;
    this.callback(action, call);
  };

  subscribeCall = (callback) => {
    this.callback = callback;
  };
}
