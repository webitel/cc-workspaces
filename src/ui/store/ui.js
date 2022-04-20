import agentInfo
  from '../modules/info-section/modules/general-info/store/agent-info';
import now from '../modules/reactive-now/reactive-now';
import userinfo from '../modules/userinfo/userinfo';

const modules = {
  userinfo,
  now,
  agentInfo,
};

export default {
  namespaced: true,
  modules,
};
