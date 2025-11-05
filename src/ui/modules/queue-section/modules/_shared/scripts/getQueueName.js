import { QueueTypeName } from '@webitel/ui-sdk/enums'

export function getQueueName(task) {
  const queueName = task.attempt?.queue?.name || task.queue?.name;
  const queueType = task.queue?.queue_type || task.attempt?.queue?.queue_type;
  if (!isTransferQueue(queueName, queueType)) {
    return queueName;
  }
  //@author o.chorpita
  // When transferring a call to a user, skip showing the "transfer" queue name
  // https://webitel.atlassian.net/browse/WTEL-7762
  return '';
}

export function isTransferQueue (queueName, queueType) {
  //https://webitel.atlassian.net/browse/WTEL-7762?focusedCommentId=704701
  return queueName === 'transfer' && queueType === QueueTypeName.NOT_IMPLEMENT;
}
