import UserinfoStoreModule from '@webitel/ui-sdk/src/modules/Userinfo/store/UserinfoStoreModule';
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';

const state = {
  thisApp: WebitelApplications.AGENT,
};

const getters = {
  IS_CALL_CENTER_LICENSE: (state, getters) => state.license.find((item) => item.prod === 'CALL_CENTER'),
};

const userinfo = new UserinfoStoreModule().getModule({ state, getters });

export default userinfo;
