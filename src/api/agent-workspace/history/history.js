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
                                        fields,
                                        direction,
                                        answeredAtFrom,
                                        answeredAtTo,
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
        fields,
        '-created_at',
        domainId,
        undefined,
        direction,
        answeredAtFrom,
        answeredAtTo,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

export const getNumberHistory = async ({
                                         page,
                                         size,
                                         search,
                                         fields,
                                       }) => {
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
        `${number || search}`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        fields,
        '-created_at',
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

export const getMemberHistory = async ({
                                         page,
                                         size,
                                         search,
                                         fields,
                                       }) => {
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
        fields,
        '-created_at',
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};
