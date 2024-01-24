import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers';
import instance from '../../../instance';

const baseUrl = '/users';

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

const usersAPIRepository = {
  getUsers,
  setUserStatus,
  getUserStatus,
};

export default usersAPIRepository;
