import ReactiveNowStoreModule from '@webitel/ui-sdk/src/store/ReactiveNowStoreModule/ReactiveNowStoreModule';
import userinfo from '../modules/userinfo/store/userinfo.js';
import infoSec from '../modules/info-section/store/infoSec';
import workSection from '../modules/work-section/store/workSection.js';
import appearance from '../modules/appearance/store/appearance';
import widget from '../modules/widget-bar/store/widget';

const modules = {
  userinfo,
  appearance,
  now: new ReactiveNowStoreModule().getModule(),
  infoSec,
  workSection,
  widget,
};

export default {
  namespaced: true,
  modules,
};
