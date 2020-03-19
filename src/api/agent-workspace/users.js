import instance from '../instance';

const BASE_URL = '/users';

// eslint-disable-next-line import/prefer-default-export
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
