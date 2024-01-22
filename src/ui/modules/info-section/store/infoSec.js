import agentInfo from '../modules/general-info/store/agent-info';
import processing from '../modules/processing/store/processing';
import client from '../modules/client-info/store/client-info';

export default {
  namespaced: true,
  modules: {
    agentInfo,
    processing,
    client,
  },
};
