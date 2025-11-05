import { CallActions, CallDirection } from 'webitel-sdk';
import { QueueTypeName } from '@webitel/ui-sdk/enums'

const isRinging = (call) => call.state === CallActions.Ringing;

const isPreviewDialer = (call) => call.queue && call.queue.queue_type ===
  QueueTypeName.PREVIEW_DIALER;

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

const isNotManualCall = (call) => (
  !call.queue?.manual_distribution
);

const isNotOfflineCall = (call) => (
  call.queue?.queue_type !== QueueTypeName.OFFLINE_QUEUE
);

const isIncomingRinging = (call) => {
  return isRinging(call)
    && isNotManualCall(call)
    && isNotOfflineCall(call)
    && [
      isInboundRinging(call),
    isOutboundPreviewDialer(call),
    isOutboundCallWithDisableAutoAnswer(call),
  ].some((condition) => !!condition);
};

export default isIncomingRinging;
