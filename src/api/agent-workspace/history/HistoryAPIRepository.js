import { CallServiceApiFactory } from 'webitel-sdk';
import configuration from '../../openAPIConfig';
import instance from '../../instance';

const defaultParams = {
  page: 1,
  size: 10,
  search: '',
  createdAtFrom: 0,
  createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
  sort: '-created_at',
};
const callService = new CallServiceApiFactory(configuration, '', instance);

const fetchHistory = async ({
                              page,
                              size,
                              createdAtFrom,
                              createdAtTo,
                              userId,
                              memberId,
                              q,
                              cause,
                              fields,
                              sort,
                              direction,
                              isMissed,
                            }) => {
  try {
    const response = await callService.searchHistoryCall(
      page,
      size,
      q,
      sort,
      fields,
      createdAtFrom,
      createdAtTo,
      userId,
      undefined,
      undefined,
      undefined,
      memberId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cause,
      undefined,
      undefined,
      undefined,
      direction,
      undefined,
      undefined,
      isMissed,
    );
    return { next: !!response.next, items: response.items || [] };
  } catch (err) {
    throw err;
  }
};

const historyAPIRepository = {
  async getHistory(argParams) {
    const params = {
      ...defaultParams,
      ...argParams,
    };
    params.q = params.search;
    return fetchHistory(params);
  },
};

export default historyAPIRepository;
