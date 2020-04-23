import { CallServiceApiFactory } from 'webitel-sdk';
import instance from '../../instance';
import configuration from '../../openAPIConfig';
import store from '../../../store/index';

const callService = new CallServiceApiFactory(configuration, '', instance);

export const getAgentHistory = async ({ page, size, search }) => {
  const { userId, domainId } = store.state.userinfo;
  const createdAtFrom = 0;
  const createdAtTo = Date.now();
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
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

export const getHistoryByNumber = () => {
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
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};
