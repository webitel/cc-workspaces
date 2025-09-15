import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ConversationState } from 'webitel-sdk';

import CatalogAPI from '../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import WorkspaceStates from '../../../../ui/enums/WorkspaceState.enum';
import ChatTransferDestination from '../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import { formatChatMessages } from '../scripts/formatChatMessages.js';

export interface ChatMessage {
  id?: string;
  member?: { self?: boolean };
  [key: string]: unknown;
}

export interface Chat {
  id: string | number;
  state?: ConversationState | string;
  draft?: string;
  contact?: { id?: string | number } | null;
  messages?: ChatMessage[];
  players?: Array<{ id: string; pause: () => void }>; // set in media store
  allowLeave?: boolean;
  allowDecline?: boolean;
  allowJoin?: boolean;
  variables?: Record<string, unknown>;
  // actions exposed by SDK
  join?: () => Promise<void>;
  send?: (message: unknown) => Promise<void>;
  leave?: () => Promise<void>;
  decline?: () => Promise<void>;
  transferToUser?: (userId: string | number) => Promise<void>;
  transferToPlan?: (planId: string | number) => Promise<void>;
}

export const useChatStore = defineStore('features/chat', () => {
  const chatList = ref<Chat[]>([]);

  const isChatActive = (chat: Chat) => chat?.state === ConversationState.Active;
  const isMyMessage = (message: ChatMessage) => message?.member?.self === true;

  const setChatList = (list: Chat[]) => { chatList.value = list; };
  const addChat = (chat: Chat) => { chatList.value.push(chat); };

  const accept = async (chat: Chat) => { await chat?.join?.(); };
  const send = async (chat: Chat, message: unknown) => { await chat?.send?.(message); };
  const sendFile = async (chat: Chat, files: File | Blob | Array<File | Blob>) => {
    if (Array.isArray(files)) await Promise.all(files.map((file) => send(chat, file)));
    else await send(chat, files);
  };
  const transfer = async ({ chat, destination, item }: { chat: Chat; destination: string; item: { id: string | number } }) => {
    if (destination === ChatTransferDestination.USER) return chat.transferToUser(item.id);
    if (destination === ChatTransferDestination.CHATPLAN) return chat.transferToPlan(item.id);
    throw new TypeError('Unknown transfer destination: ' + destination);
  };
  const close = async (chat: Chat, handleChatEnd: (chat: Chat) => Promise<void>) => {
    if (chat.allowLeave) await chat.leave();
    else await chat.decline();
    await handleChatEnd(chat);
  };
  const openChat = async (chat: Chat) => {
    const isClosed = !chat?.contact?.id;
    if (isClosed) {
      const { items: messages } = await CatalogAPI.getChatMessagesList({ chatId: chat.id });
      chat.messages = formatChatMessages(messages) as ChatMessage[];
    }
    return { type: WorkspaceStates.CHAT, task: chat };
  };
  const chatInsertToStart = (chat: Chat) => {
    const chatPosition = chatList.value.indexOf(chat);
    const list = chatList.value.slice();
    list.splice(chatPosition, 1);
    list.unshift(chat);
    chatList.value = list;
  };

  return {
    chatList,
    isChatActive,
    isMyMessage,
    setChatList,
    addChat,
    accept,
    send,
    sendFile,
    transfer,
    close,
    openChat,
    chatInsertToStart,
  };
});


