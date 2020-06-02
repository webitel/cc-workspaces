import instance from '../../instance';

const BASE_URL = '/users';

const fetchUsers = async (url) => {
  try {
    const response = await instance.get(url);
    return { next: !!response.next, items: response.items || [] };
  } catch (err) {
    throw err;
  }
};

const usersAPIRepository = {
  async getUsers({
                   page = 1,
                   size = 20,
                   search = '',
                   fields,
                 }) {
    let url = `${BASE_URL}?page=${page}&size=${size}&sort=name`;
    if (search) url += `&name=${search}*`;
    if (fields) url += `&fields=${fields}`;
    return fetchUsers(url);
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
