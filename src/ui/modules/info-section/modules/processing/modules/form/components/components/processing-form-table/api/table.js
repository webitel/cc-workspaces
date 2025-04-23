import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();

const getList = async ({ path, ...params }) => {

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search }),
    camelToSnake(),
    generateUrl(path),
  ]);

  try {
    const response = await instance.get(url);
    return applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const TableApi = {
  getList,
};

export default TableApi;
