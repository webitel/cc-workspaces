import { createUserAccessControlComposable } from '@webitel/ui-sdk/modules/Userinfo';

export let useUserAccessControl = (): any => {
	throw new Error('useUserAccessControl is not created');
};

export const createUserAccessControl = (useUserinfoStore) => {
	useUserAccessControl = createUserAccessControlComposable(useUserinfoStore);
	return useUserAccessControl;
};
