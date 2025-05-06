import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index';
import applyTransform, {
  camelToSnake,
  snakeToCamel,
  generateUrl,
  merge,
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index';

const instance = getDefaultInstance();

const getList = async ({ path, ...params }) => {

  const listResponseHandler = (items) => {
    return items.map((item) => { // @liza because of name:{common_name: 'Contact'} in contact object https://webitel.atlassian.net/browse/WTEL-6797
      if (item.name?.commonName) {
        return {
          ...item,
          name: item.name.commonName
        };
      } else return item;
    });
  };

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search }),
    camelToSnake(),
    generateUrl(path),
  ]);

  try {
    const response = await instance.get(url);
    const { data, items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
      snakeToCamel(),
    ]);

    return {
      // Some endpoints return data, some return items so we need to check for both of them
      items: applyTransform(data || items, [
        listResponseHandler,
        ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const TableApi = {
  getList,
};

export default TableApi;
