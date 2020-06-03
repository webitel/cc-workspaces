import instance from '../../instance';

const BASE_URL = '/users';

const fetchUsers = async (url) => {
  try {
    const response = await instance.get(url);
    if (response.items) {
      return response.items;
    }
    return [];
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
                   sort,
                   filters,
                 }) {
    console.log(filters);
    let url = `${BASE_URL}?page=${page}&size=${size}`;
    if (search) url += `&name=${search}*`;
    if (fields) url += `&fields=${fields}`;
    if (filters) url += `&${filters}`;
    url += sort ? `&sort=${sort}` : '&sort=name';
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
