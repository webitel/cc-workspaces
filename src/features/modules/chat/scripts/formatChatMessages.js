import getFileUrl from './getFileUrl.js';

const formatMessageFile = (file) => { // added field 'mime' and 'url' to message`s file object if message dosen't have
  if (!file) return null;
  return {
    ...file,
    mime: file.mime || file.type,
    url: file.url || getFileUrl(file),
  };
};

export const getMessageMember = (value) => {
  const type = value?.type === 'user' ? 'webitel' : value?.type;
  return { ...value, type };
};

export const formatChatMessages = (messages) => { // make chat-history messages more similar to current-chat messages
  return messages.map((item) => {
    return {
      ...item,
      createdAt: item.date,
      member: item.member || getMessageMember(item.peer),
      file: formatMessageFile(item.file),
    };
  }).reverse();
};

export const isSelfSideChatMessage = (message) => {
  const isSelfMessage = message.member?.self
    || message.member?.type === "webitel";

  const isBot = message.member?.type === "bot" || isMemberTypeBot(message);

  return isSelfMessage || isBot;
}

export const isMemberTypeBot = ((message) =>
  /* @author ye.pohranichna
  * because on Workspace we don't get from backend info about bot message type  */
  !message.member?.type && !message.channelId);
