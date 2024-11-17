import { CallActions, CallDirection } from 'webitel-sdk';

const isRinging = (call) => call.state === CallActions.Ringing;

const isPreviewDialer = (call) => call.queue && call.queue.queue_type ===
  'preview';

const isOutboundPreviewDialer = (call) => (
  call.direction === CallDirection.Outbound && isPreviewDialer(call)
);

// https://webitel.atlassian.net/browse/WTEL-3602
const isOutboundCallWithDisableAutoAnswer = (call) => (
  // call.direction === CallDirection.Outbound && call.allowAnswer
  // should i check for autoAnswer? https://webitel.atlassian.net/browse/DEV-4714
  call.direction === CallDirection.Outbound && call.allowAnswer &&
  !call.params.autoAnswer
);

const isInboundRinging = (call) => (
  call.direction === CallDirection.Inbound
);

const isIncomingRinging = (call) => {
  return isRinging(call) && [
    isInboundRinging(call),
    isOutboundPreviewDialer(call),
    isOutboundCallWithDisableAutoAnswer(call),
  ].some((condition) => !!condition);
};

export default isIncomingRinging;
