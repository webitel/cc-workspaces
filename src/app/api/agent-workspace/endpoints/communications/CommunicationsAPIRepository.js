import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import configuration from '../../../openAPIConfig';
import instance from '../../../instance';
import applyTransform, {
  merge, notify,
  snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers';
import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults';

const communicationService = new CommunicationTypeServiceApiFactory(configuration, '', instance);

const getCommunicationsList = async (params) => {
  const {
      page,
      size,
      search,
      sort,
      fields,
      id,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await communicationService.searchCommunicationType(
      page,
      size,
      search,
      sort,
      fields,
      id,
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

const communicationsAPIRepository = {
  getList: getCommunicationsList,
};

export default communicationsAPIRepository;
