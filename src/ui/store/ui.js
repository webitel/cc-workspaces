import ReactiveNowStoreModule from '@webitel/ui-sdk/src/store/ReactiveNowStoreModule/ReactiveNowStoreModule';
import userinfo from '../modules/userinfo/userinfo';
import infoSec from '../modules/info-section/store/infoSec';
import appearance from '../modules/appearance/store/appearance';

const modules = {
  userinfo,
  appearance,
  now: new ReactiveNowStoreModule().getModule(),
  infoSec,
};

export default {
  namespaced: true,
  modules,
};
