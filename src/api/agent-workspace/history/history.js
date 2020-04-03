import { CallServiceApiFactory } from 'webitel-sdk';
import instance from '../../instance';
import configuration from '../../openAPIConfig';
import store from '../../../store/index';

const callService = new CallServiceApiFactory(configuration, '', instance);

export const getAgentHistory = async ({ page, size, search }) => {
  const { userId, domainId } = store.state.userinfo;
  // eslint-disable-next-line no-unused-vars
  let formattedSearch = search;
  if (search.length && search.slice(-1) !== '*') formattedSearch += '*';
  const createdAtFrom = 0;
  const createdAtTo = Date.now();
  try {
    const response = await callService
      .searchHistoryCall(page, size, createdAtFrom, createdAtTo, userId, domainId);
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

export const getHistoryByNumber = () => {};

export const getHistoryByMember = () => {};
