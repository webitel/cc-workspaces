import { CallActions } from 'webitel-sdk';

export default class MockSocket {
  constructor(call) {
    this.call = call;
  }

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
    this.callback(action, call);
  };

  subscribeCall = (callback) => {
    this.callback = callback;
  };
}
