import { AgentServiceApiFactory } from 'webitel-sdk';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  mergeEach,
  merge,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const service = new AgentServiceApiFactory(configuration, '', instance);

const getUsers = async (params) => {
  const defaultObject = {
    extension: '',
    id: '',
    name: '',
    presence: [],
    status: '',
  };

  const listResponseHandler = (items) => {
    return items.map((item) => ({
      ...item,
    }));
  };

  const {
    page,
    size,
    search,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    snakeToCamel(),
  ]);

  try {
    const response = await service.searchUserStatus(
      page,
      size,
      search,
    );
    console.log('Users1 resp:', response);
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);

    return {
      items: applyTransform(items, [
        mergeEach(defaultObject),
        listResponseHandler,
      ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const setUserStatus = async (status) => {
  const url = '/presence';
  try {
    await instance.patch(url, { status });
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const getUserStatus = async () => {
  const url = '/user';

  try {
    const response = await instance.get(url);
    return response.data.presence;
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const getLookup = (params) => getUsers({
  ...params,
  fields: params.fields || ['id', 'name'],
});

const usersAPIRepository = {
  getUsers,
  setUserStatus,
  getUserStatus,
  getLookup,
};

export default usersAPIRepository;
