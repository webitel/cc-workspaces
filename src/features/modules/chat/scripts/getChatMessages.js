import { formatChatMessages } from './formatChatMessages.js';
import CatalogAPI
  from '../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';

export default async function (chatId) {
  const { items } = await CatalogAPI.getChatMessagesList({ chatId });
  return formatChatMessages(items);
  };
