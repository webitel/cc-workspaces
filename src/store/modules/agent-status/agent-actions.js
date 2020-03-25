
const actions = {
  SET_AGENT_WAITING_STATUS: (context) => {
    try {
      context.state.agent.waiting();
    } catch {
    }
  },

  SET_AGENT_PAUSE_STATUS: (context, note = '') => {
    try {
      context.state.agent.pause(note);
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
