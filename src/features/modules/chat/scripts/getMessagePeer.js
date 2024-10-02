export default function (message) { // get message`s peer object from another message fields
  let type;
  if (!message.channelId) type = 'bot';
  else if (message.member?.self || message.member?.type === 'webitel') type = 'user';
  else type = message.member?.type;

  return {
    ...message.member,
    type,
  }
};
