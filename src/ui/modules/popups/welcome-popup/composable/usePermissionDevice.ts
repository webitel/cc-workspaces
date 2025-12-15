import type { Ref } from 'vue';
import { Permission, PermissionMessage } from '../types/permissions.types';
import { watch } from 'vue';

export function usePermissionDevice () {
  const setPermission = (
    target: Ref<Permission>,
    status: boolean,
    message: PermissionMessage = PermissionMessage.None,
  ): void => {
    target.value.status = status;
    target.value.message = message;
  };
  const applyMediaPermissionState = (
    target: Ref<Permission>,
    isGranted: boolean,
    isDenied: boolean,
    hasDevices: boolean,
  ): void => {
    let message = PermissionMessage.None;

    if (isDenied) {
      message = PermissionMessage.Denied;
    } else if (isGranted && !hasDevices) {
      message = PermissionMessage.NotFound;
    }

    setPermission(target, isGranted && hasDevices, message);
  };

const setupMediaPermissionWatch = ({
 permissionState,
 permissionGranted,
 devices,
 target,
 withToggle = false,
}: {
    permissionState: Ref<PermissionState | undefined>;
    permissionGranted: Ref<boolean>;
    devices: Ref<MediaDeviceInfo[]>;
    target: Ref<Permission>;
    withToggle?: boolean;
  }) => {
    watch(
      [permissionState, permissionGranted, devices],
      ([state, granted, inputs]) => {
        if (!state) return;

        const isGranted = state === 'granted';
        const isDenied = state === 'denied';
        const hasDevices = granted || inputs.length > 0;

        if (withToggle) {
          const isKnownState = isGranted || isDenied;
          target.value.enabled = isKnownState;
          target.value.disabled = !isKnownState;
        }

        applyMediaPermissionState(target, isGranted, isDenied, hasDevices);
      },
      { immediate: true },
    );
  };

  return {
    setupMediaPermissionWatch,
    setPermission,
    applyMediaPermissionState
  }
}
