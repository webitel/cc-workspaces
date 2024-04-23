import agentInfo from '../modules/general-info/store/agent-info';
import processing from '../modules/processing/store/processing';
import client from '../modules/client-info/store/client-info';
import flow from '../modules/flow/store/flow';

export default {
  namespaced: true,
  modules: {
    agentInfo,
    processing,
    client,
    flow,
  },
};
