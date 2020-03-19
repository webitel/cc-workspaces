
const actions = {
  SET_AGENT_WAITING_STATUS: (context) => {
    try {
      context.state.agent.waiting();
    } catch {
    }
  },

  SET_AGENT_PAUSE_STATUS: (context) => {
    try {
      context.state.agent.pause({});
    } catch {
    }
  },

  AGENT_LOGOUT: (context) => {
    try {
      context.state.agent.logout();
    } catch {
    }
  },
};

export default {
  actions,
};
