import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  merge, notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { CallServiceApiFactory } from 'webitel-sdk';

import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const callService = new CallServiceApiFactory(configuration, '', instance);

const getHistory = async (params) => {
  const defaultParams = {
    sort: '-created_at',
    createdAtFrom: 0,
    createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
  }
  const {
    page,
    size,
    search,
    sort,
    fields,
    createdAtFrom,
    createdAtTo,
    userId,
    memberId,
    cause,
    direction,
    isMissed,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    merge(defaultParams),
  ]);

  try {
    const response = await callService.searchHistoryCall(
      page, size, undefined, sort, fields, createdAtFrom, createdAtTo, userId, undefined,
      undefined, undefined, memberId, undefined, undefined, undefined,
      undefined, undefined, cause, undefined, undefined, search, direction,
      undefined, undefined, isMissed
    );
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

const historyAPIRepository = {
  getHistory,
};

export default historyAPIRepository;
