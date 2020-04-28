
const actions = {
  SET_AGENT_WAITING_STATUS: (context) => {
    try {
      context.state.agent.online();
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
      context.state.agent.offline();
    } catch {
    }
  },
};

export default {
  actions,
};
