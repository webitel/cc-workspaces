import now from '@webitel/cc-ui-sdk/src/store/modules/now/reactive-now';
import userinfo from '../modules/userinfo/userinfo';
import infoSec from '../modules/info-section/store/infoSec';

const modules = {
  userinfo,
  now,
  infoSec,
};

export default {
  namespaced: true,
  modules,
};
