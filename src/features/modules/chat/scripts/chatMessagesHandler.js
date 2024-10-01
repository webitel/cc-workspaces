import getMessagePeer from './getMessagePeer.js';
import getMessageFile from './getMessageFile.js';
export default function(messages) { // make current chat and chat history messages more similar
  return messages.map((item) => {
    return {
      ...item,
      date: item.date || item.createdAt,
      peer: item.peer || getMessagePeer(item),
      file: getMessageFile(item.file),
    };
  });
};
