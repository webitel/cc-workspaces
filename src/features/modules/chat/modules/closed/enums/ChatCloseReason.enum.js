const CloseChatReason = Object.freeze({
  AGENT_TIMEOUT: 'agent_timeout',
  CLIENT_TIMOUT: 'client_timeout',
  SILENCE_TIMEOUT: 'silence_timeout',
  AGENT_LEAVE: 'agent_leave',
  CLIENT_LEAVE: 'client_leave',
  TRANSFER: 'transfer',
});

export default CloseChatReason;
