import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  merge, mergeEach,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import instance from '../../../../../../../../app/api/instance';
import configuration from '../../../../../../../../app/api/openAPIConfig';

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

const CommunicationsAPI = {
  getList: getCommunicationsList,
};

export default CommunicationsAPI;
