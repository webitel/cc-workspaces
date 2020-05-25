import { CallServiceApiFactory } from 'webitel-sdk';
import instance from '../../instance';
import configuration from '../../openAPIConfig';
// eslint-disable-next-line import/no-cycle
import store from '../../../store/index';

const callService = new CallServiceApiFactory(configuration, '', instance);

export const getAgentHistory = async ({
                                        page = 1,
                                        size = 10,
                                        search = '',
                                        createdAtFrom = 0,
                                        createdAtTo = Date.now(),
                                        // direction,
                                        // answeredAt,
                                      }) => {
  const { userId, domainId } = store.state.userinfo;
  try {
    const response = await callService
      .searchHistoryCall(
        page,
        size,
        createdAtFrom,
        createdAtTo,
        userId,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        `${search}`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '-created_at',
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

// eslint-disable-next-line no-unused-vars
export const getNumberHistory = async ({ page, size, search }) => {
  const { domainId } = store.state.userinfo;
  const number = store.state.call.callOnWorkspace.displayNumber;
  const createdAtFrom = 0;
  const createdAtTo = Date.now();
  try {
    const response = await callService
      .searchHistoryCall(
        page,
        size,
        createdAtFrom,
        createdAtTo,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        `${number}`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '-created_at',
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

export const getMemberHistory = async ({ page, size, search }) => {
  const { domainId } = store.state.userinfo;
  const { memberOnWorkspace } = store.state.member;
  const createdAtFrom = 0;
  const createdAtTo = Date.now();
  try {
    const response = await callService
      .searchHistoryCall(
        page,
        size,
        createdAtFrom,
        createdAtTo,
        undefined,
        undefined,
        undefined,
        undefined,
        memberOnWorkspace.id,
        undefined,
        `${search}`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '-created_at',
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};
