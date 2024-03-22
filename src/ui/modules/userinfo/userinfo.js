import UserinfoStoreModule from '@webitel/ui-sdk/src/modules/Userinfo/store/UserinfoStoreModule';
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';

const state = {
  thisApp: WebitelApplications.AGENT,
};

const userinfo = new UserinfoStoreModule().getModule({ state });

export default userinfo;
