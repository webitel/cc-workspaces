import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  merge, notify, snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { CallServiceApiFactory } from 'webitel-sdk';
import instance from '../../../../../../app/api/instance';
import configuration from '../../../../../../app/api/openAPIConfig';

console.info(instance);

const callService = new CallServiceApiFactory(configuration, '', instance);

const getMissedCalls = async (params) => {
  const defaultParams = {
    answeredAtFrom: 0,
    answeredAtTo: 0,
    createdAtFrom: new Date().setHours(0, 0, 0, 0), // today
    createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
    fields: ['from', 'created_at', 'id'],
    isMissed: true,
  };


  const {
    page,
    size,
    search,
    sort,
    fields,
    answeredAtFrom,
    answeredAtTo,
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
    const response = await callService.searchHistoryCallPost({
      page,
      size,
      q: search,
      sort,
      fields,
      created_at: {
        from: createdAtFrom,
        to: createdAtTo,
      },
      answered_at: {
        from: answeredAtFrom,
        to: answeredAtTo,
      },
      owner_id: [userId],
      member_id: memberId,
      cause,
      direction,
      missed: isMissed,
    });

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

const redialToMissed = async ({ callId }) => {
  try {
    const response = await callService.redialCall(callId, {
      callId,
    });
    return response.data;
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
}

const hideMissedCall = async ({ callId }) => {
  try {
    const response = await callService.patchHistoryCall(callId, {
      id: callId,
      hide_missed: true,
    });
    return response.data;
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const missedAPI =  {
  getMissedCalls,
  redialToMissed,
  hideMissedCall,
};

export default missedAPI;
