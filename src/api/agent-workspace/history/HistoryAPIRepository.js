import { CallServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import configuration from '../../openAPIConfig';
import instance from '../../instance';

const callService = new CallServiceApiFactory(configuration, '', instance);

const _getHistory = (getList) => function ({
                                             page,
                                             size,
                                             search,
                                             sort = '-created_at',
                                             fields,
                                             createdAtFrom = 0,
                                             createdAtTo = new Date().setHours(23, 59, 59, 999), // today end
                                             userId,
                                             memberId,
                                             cause,
                                             direction,
                                             isMissed,
                                           }) {
  const params = [page, size, search, sort, fields, createdAtFrom, createdAtTo, userId, undefined,
    undefined, undefined, memberId, undefined, undefined, undefined, undefined, undefined,
    cause, undefined, undefined, undefined, direction, undefined, undefined, isMissed];
  return getList(params);
};

const listGetter = new SdkListGetterApiConsumer(callService.searchHistoryCall)
  .setGetListMethod(_getHistory);

const getHistory = (params) => listGetter.getList(params);

const historyAPIRepository = {
  getHistory,
};

export default historyAPIRepository;
