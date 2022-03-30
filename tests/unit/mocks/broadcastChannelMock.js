class BroadcastChannelMock {
  constructor(name) {
    this.name = name;
    this.closed = false;
  }

  addEventListener(event, cb) {
    this.event = event;
  }

  postMessage(message) {
    this.message = message;
  }

  close() {
    this.closed = true;
  }
}

global.BroadcastChannel = BroadcastChannelMock;
