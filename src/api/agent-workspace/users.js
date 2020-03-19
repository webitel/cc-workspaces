import instance from '../instance';

const BASE_URL = '/users';

export async function getUsersList(search) {
  const size = 20;
  let url = `${BASE_URL}?size=${size}`;
  if (search) url += `&name=${search}*`;

  try {
    const response = await instance.get(url);
    if (response.items) {
      return response.items.map((item) => ({
        name: item.name,
        extension: item.extension,
        presence: !!item.presence,
        id: item.id,
      }));
    }
    return [];
  } catch (err) {
    throw err;
  }
}

export async function getUserStatus() {
  const url = '/user';

  try {
    const response = await instance.get(url);
    return response.presence;
  } catch (err) {
    throw err;
  }
}

export async function setUserStatus(status = '') {
  const url = '/presence';

  try {
    await instance.patch(url, { status });
  } catch (err) {
    throw err;
  }
}
