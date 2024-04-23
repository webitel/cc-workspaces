import agentInfo from '../modules/general-info/store/agent-info';
import processing from '../modules/processing/store/processing';
import client from '../modules/client-info/store/client-info';
import flows from '../modules/flows/store/flows';

export default {
  namespaced: true,
  modules: {
    agentInfo,
    processing,
    client,
    flows,
  },
};
