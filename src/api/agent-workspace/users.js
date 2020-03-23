import instance from '../instance';
import UserStatus from '../../store/statusUtils/UserStatus';

const BASE_URL = '/users';

export const getUsersList = async (search) => {
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
};

export const getUserStatus = async () => {
  const url = '/user';

  try {
    const response = await instance.get(url);
    return response.presence;
  } catch (err) {
    throw err;
  }
};

export const setUserStatus = async (status = '') => {
  const url = '/presence';

  try {
    await instance.patch(url, { status });
  } catch (err) {
    throw err;
  }
};

export const parseUserStatus = (presence) => {
  if (presence.status.includes('dnd')) {
    return UserStatus.DND;
  }
  if (presence.status.includes('wss')) {
    return UserStatus.ACTIVE;
  }
  return '';
};
