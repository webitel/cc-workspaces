import { RoutingChatPlanServiceApiFactory } from 'webitel-sdk';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  merge,
  notify,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const chatplanService = new RoutingChatPlanServiceApiFactory(configuration, '', instance);

const getChatplans= async (params) => {
  const {
    page,
    size,
    search,
    fields,
    sort,
    id,
    enabled,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await chatplanService.searchChatPlan(
      page,
      size,
      search,
      sort,
      fields,
      id,
      undefined,
      enabled,
    );
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    console.log('Chatplans resp:', response);
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

const chatplanAPIRepository = {
  getChatplans,
};

export default chatplanAPIRepository;
