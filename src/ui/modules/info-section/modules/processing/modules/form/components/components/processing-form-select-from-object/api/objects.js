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
  sanitize,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import get from 'lodash/get';
import { computed } from 'vue';

const instance = getDefaultInstance();

const regExpCustomDisplay = /\{([^}]+)\}/g;

const checkSimpleTemplate = (display) => {
  const match = display?.match(regExpCustomDisplay);

  return match ? false : display;
};

const transformDisplayName = (display, item) => {
  return display.replace(
    regExpCustomDisplay,
    (_, key) =>
      key.split('.').reduce((obj, prop) => obj?.[prop], item) ?? `{${key}}`,
  );
};

const transformItemsForSelect =
  ({ primary, display }) =>
  (items) => {
    return items.map((item) => ({
      id: item[primary],
      name: checkSimpleTemplate(display)
        ? get(item, display.split('.'))
        : transformDisplayName(display, item),
    }));
  };

// In this method we are using the same API as in getObjectRecordsLookup,
// but we are using different parameters, so we need to create a new method where we can pass the type of the lookup where type is path to api
// for example: 'cities' has type 'dictionary/cities'
const getObjectRecordsLookup = async ({
  path,
  display,
  primary,
  ...params
}) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(path),
  ]);
  try {
    const response = await instance.get(url);
    const { data, items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);

    return {
      // Some endpoints return data, some return items so we need to check for both of them
      items:
        applyTransform(data || items, [
          transformItemsForSelect({ display, primary }),
        ]) ?? [],
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ObjectApi = {
  getLookup: getObjectRecordsLookup,
};

export default ObjectApi;
