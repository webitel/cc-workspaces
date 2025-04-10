import { createUserAccessControlComposable } from '@webitel/ui-sdk/src/composables/useAccessControl/v2/createUserAccessControl';
import type { UseAccessControlReturn } from '@webitel/ui-sdk/src/composables/useAccessControl/v2/types/CreateUserAccessControl';

export let useUserAccessControl = (): UseAccessControlReturn => {
  throw new Error('useUserAccessControl is not created');
};

export const createUserAccessControl = (useUserinfoStore) => {
  useUserAccessControl = createUserAccessControlComposable(useUserinfoStore);
  return useUserAccessControl;
};
