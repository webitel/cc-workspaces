import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import configuration from '../../../openAPIConfig';
import instance from '../../../instance';
import applyTransform, {
  merge, mergeEach, notify,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';

const communicationService = new CommunicationTypeServiceApiFactory(configuration, '', instance);

const getCommunicationsList = async (params) => {
  const defaultObject = {
    default: false,
  };

  const {
    page,
    size,
    search,
    sort,
    fields,
    id,
    channel,
    defaultValue,
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
      channel,
      defaultValue,
    );
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [
        mergeEach(defaultObject),
      ]),
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
