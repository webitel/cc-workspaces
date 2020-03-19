
const actions = {
  SET_WAITING_STATUS: (context) => {
    try {
      context.state.agent.waiting();
      console.log(context.state.agent);
    } catch {
    }
  },

  SET_PAUSE_STATUS: (context) => {
    try {
      context.state.agent.pause({});
      console.log(context.state.agent);
    } catch {
    }
  },

  LOGOUT: (context) => {
    try {
      context.state.agent.logout();
      console.log(context.state.agent);
    } catch {
    }
  },
};

export default {
  actions,
};
