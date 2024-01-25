import { AgentServiceApiFactory } from 'webitel-sdk';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  merge, mergeEach, notify, snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers';
import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const service = new AgentServiceApiFactory(configuration, '', instance);

const usersAPIRepository = {
  async getUsers(params) {
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
  },
  async setUserStatus(status) {
    const url = '/presence';
    try {
      await instance.patch(url, { status });
    } catch (err) {
      throw err;
    }
  },
  async getUserStatus() {
    const url = '/user';

    try {
      const response = await instance.get(url);
      return response.presence;
    } catch (err) {
      throw err;
    }
  },
};

export default usersAPIRepository;
