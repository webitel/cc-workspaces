import instance from '../instance';
import store from '../../store';

// gets user by token from localstorage
// stores response username in vuex
export default async () => {
  const url = '/userinfo';

  const defaultObject = {
    domainId: 0,
    username: '',
    userId: 0,
    scope: [],
    roles: [],
    license: [],
  };

  const token = localStorage.getItem('access-token');
  if (token) {
    try {
      const response = await instance.get(url);
      localStorage.setItem('domain', response.dc);
      store.dispatch('userinfo/SET_SESSION', { ...defaultObject, ...response });
    } catch (err) {
      throw err;
    }
  }
};
