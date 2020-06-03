import { CallServiceApiFactory } from 'webitel-sdk';
import configuration from '../../utils/openAPIConfig';
import instance from '../../instance';

const defaultParams = {
  page: 1,
  size: 10,
  search: '',
  createdAtFrom: 0,
  createdAtTo: Date.now(),
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
                              fields,
                              sort,
                              direction,
                              isMissed,
                            }) => {
  try {
    const response = await callService.searchHistoryCall(
      page,
      size,
      createdAtFrom,
      createdAtTo,
      userId,
      undefined,
      undefined,
      undefined,
      memberId,
      undefined,
      q,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      fields,
      sort,
      undefined,
      undefined,
      direction,
      undefined,
      undefined,
      isMissed,
    );
    return response.items || [];
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
    return fetchHistory(params);
  },
};

export default historyAPIRepository;
