import ReactiveNowStoreModule from '@webitel/ui-sdk/src/store/ReactiveNowStoreModule/ReactiveNowStoreModule';

import appearance from '../modules/appearance/store/appearance';
import infoSec from '../modules/info-section/store/infoSec';
import userinfo from '../modules/userinfo/userinfo';
import widget from '../modules/widget-bar/store/widget';

const modules = {
  userinfo,
  appearance,
  now: new ReactiveNowStoreModule().getModule(),
  infoSec,
  widget,
};

export default {
  namespaced: true,
  modules,
};
