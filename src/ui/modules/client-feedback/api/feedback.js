import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index';
import applyTransform, {
  addQueryParamsToUrl,
  camelToSnake,
  generateUrl,
  merge,
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index';

const instance = getDefaultInstance();

const getFeedback = async ({ ...params }) => {
  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search }),
    camelToSnake(),
    generateUrl('feedback'),
    addQueryParamsToUrl(filters),
  ]);

  try {
    const response = await instance.get(url);
    const { data } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);

    return data;
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const FeedbackApi = {
  getFeedback,
};

export default FeedbackApi;
