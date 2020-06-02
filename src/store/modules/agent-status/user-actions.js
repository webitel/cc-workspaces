import APIRepository from '../../../api/APIRepository';

const usersAPI = APIRepository.users;

const actions = {
  SET_USER_ACTIVE_STATUS: async () => {
    await usersAPI.setUserStatus('');
  },

  SET_USER_DND_STATUS: async () => {
    await usersAPI.setUserStatus('dnd');
  },
};

export default {
  actions,
};
