import configuration from '../../../../../../../app/api/openAPIConfig.js';
import instance from '../../../../../../../app/api/instance.js';

import { CatalogApiFactory, AgentChatsServiceApiFactory } from 'webitel-sdk';
import applyTransform, {
  merge, notify,
  snakeToCamel,
  camelToSnake,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';

const catalogService = new CatalogApiFactory(configuration, '', instance);

const agentChatsService = new AgentChatsServiceApiFactory(configuration, '', instance);

const getChatMessagesList = async ({ chatId }) => {
  const mergeMessagesData = ({ messages, peers }) => {
    return messages.map(({ from, ...message }) => {
      return {
        ...message,
        peer: peers[from.id - 1],
      };
    });
  };

  try {
    const response = await catalogService.getHistory(chatId);

    const { messages, peers } = applyTransform(response.data, [
      snakeToCamel(),
    ]);
    return {
      items: applyTransform({ messages, peers }, [mergeMessagesData]),
      peers,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchChat = async (chatId) => {
  console.log('patch:', chatId);
  try {
    const response = await agentChatsService.markChatProcessed(chatId);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getList = async (params) => {
  const { onlyClosed, fields } = params;

  try {
    const response = await agentChatsService.getAgentChats(
      undefined,
      undefined,
      undefined,
      fields,
      undefined,
      onlyClosed,
    );
    const { items } = applyTransform(response.data, [
      snakeToCamel(),
    ]);
    console.log('items:', items);
    return items;
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const CatalogAPI = {
  getChatMessagesList,
  getList,
  patchChat,
};
export default CatalogAPI;
