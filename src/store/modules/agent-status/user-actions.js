import { setUserStatus } from '../../../api/agent-workspace/users';

const actions = {
  SET_USER_ACTIVE_STATUS: async () => {
    await setUserStatus('');
  },

  SET_USER_DND_STATUS: async () => {
    await setUserStatus('dnd');
  },
};

export default {
  actions,
};
