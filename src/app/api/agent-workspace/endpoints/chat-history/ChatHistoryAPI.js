import applyTransform, {
  merge,
  snakeToCamel,
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { getDefaultGetListResponse, } from '@webitel/ui-sdk/src/api/defaults/index.js';
import { ContactsChatCatalogApi } from 'webitel-sdk';
import configuration from '../../../openAPIConfig';
import instance from '../../../instance';

const contactChatService = new ContactsChatCatalogApi(configuration, '', instance);

const getMessages = async ({ id }) => {
  try {
    const response = await contactChatService.getContactChatHistory2(id);
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }

};

const getChat = async ({ contactId, chatId }) => {
  try {
    const response = await contactChatService.getContactChatHistory(contactId, chatId);
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

export default {
  getMessages,
  getChat,
};
