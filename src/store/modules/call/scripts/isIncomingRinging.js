import { CallActions, CallDirection } from 'webitel-sdk';

const isIncomingRinging = (call) => {
  const isPreviewDialer = call.queue && call.queue.queue_type === 'preview';
  return call.state === CallActions.Ringing // Inbound ringing
    && (
      call.direction === CallDirection.Inbound
      || (call.direction === CallDirection.Outbound // Outbound preview dialer
        && isPreviewDialer)
    );
};

export default isIncomingRinging;
