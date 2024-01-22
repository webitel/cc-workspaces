import { EndpointListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import { objCamelToSnake } from '@webitel/ui-sdk/src/scripts/caseConverters';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers';
import instance from '../../../instance';

const baseUrl = '/users';

// const listGetter = new EndpointListGetterApiConsumer({ baseUrl, instance });

// async getUsers(params) {
//   return listGetter.getList(objCamelToSnake(params));
// };

const getUsers = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(baseUrl),
  ]);
  try {
    const response = await instance.get(url);
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

// async setUserStatus(status) {
//   const url = '/presence';
//   try {
//     await instance.patch(url, { status });
//   } catch (err) {
//     throw err;
//   }
// };

const setUserStatus = async (changes) => {
  const url = '/presence';
  try {
    await instance.patch(url, { changes });
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

// async getUserStatus() {
//   const url = '/user';
//
//   try {
//     const response = await instance.get(url);
//     return response.presence;
//   } catch (err) {
//     throw err;
//   }
// };

const getUserStatus = async () => {
  const url = '/user';

  try {
    const response = await instance.get(url);
    return response.presence;
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const usersAPIRepository = {
  getUsers,
  setUserStatus,
  getUserStatus,
};

export default usersAPIRepository;
