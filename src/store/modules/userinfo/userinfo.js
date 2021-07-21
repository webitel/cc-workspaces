import ApplicationsAccess from '@webitel/ui-sdk/src/modules/Userinfo/classes/ApplicationsAccess';
import UserinfoStoreModule from '@webitel/ui-sdk/src/modules/Userinfo/store/UserinfoStoreModule';

// register api's
import authAPI from '@webitel/ui-sdk/src/modules/Userinfo/api/auth';
import userinfoAPI from '@webitel/ui-sdk/src/modules/Userinfo/api/userinfo';
import instance from '../../../api/instance';

import router from '../../../router';

authAPI.setInstance(instance);
userinfoAPI.setInstance(instance);

const actions = {
  REDIRECT_TO_AUTH: () => router.replace('/auth'),
  /*
  * copy-pasted OPEN_SESSION action from UserinfoStoreModule + added day-length token check
  * suppose it would be better to add BEFORE/AFTER SET_SESSION HOOKS in UserinfoStoreModule
  * and make this check in these hook instead of copy-paste overriding base action
  * */
  OPEN_SESSION: async (context) => {
    const DAY_LENGTH = 24 * 60 * 60 * 1000;

    await context.dispatch('BEFORE_OPEN_SESSION_HOOK');
    if (!localStorage.getItem('access-token')) {
      context.dispatch('REDIRECT_TO_AUTH');
      throw new Error('No access-token in localStorage');
    }
    const session = await userinfoAPI.getSession();

    if ((session.expiresAt - Date.now() < DAY_LENGTH)) {
      await authAPI.logout();
      await router.replace('/auth');
      return;
    }

    await context.dispatch('SET_SESSION', session);
    const access = await userinfoAPI.getApplicationsAccess();
    await context.dispatch('SET_APPLICATIONS_ACCESS', new ApplicationsAccess({ access }).getAccess());
    await context.dispatch('AFTER_OPEN_SESSION_HOOK');
  },
};

const userinfo = new UserinfoStoreModule().getModule({ actions });

export default userinfo;
