import { EndpointListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import { objCamelToSnake } from '@webitel/ui-sdk/src/scripts/caseConverters';
import instance from '../../../instance';

const baseUrl = '/users';

const listGetter = new EndpointListGetterApiConsumer({ baseUrl, instance });

const usersAPIRepository = {
  async getUsers(params) {
    return listGetter.getList(objCamelToSnake(params));
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
