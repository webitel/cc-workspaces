import { CallServiceApiFactory } from 'webitel-sdk';
import applyTransform, {
  merge, notify,
  snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';
import configuration from '../../../openAPIConfig';
import instance from '../../../instance';

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
    starToSearch('search'),
  ]);

  try {
    const response = await callService.searchHistoryCall(
      page, size, undefined, sort, fields, createdAtFrom, createdAtTo, undefined, undefined,
      undefined, undefined, memberId, undefined, undefined, undefined,
      undefined, undefined, cause, undefined, undefined, search, direction,
      undefined, undefined, isMissed, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, userId,
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
